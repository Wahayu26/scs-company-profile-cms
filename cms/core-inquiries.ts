import { Pool } from "pg";

export type CoreInquiry = {
  publicReference: string; name: string; company: string; email: string; phone: string | null;
  message: string; interestSolution: string | null; sourcePage: string | null;
  preferredContact: string | null; status: string; createdAt: Date;
  lastStatusChangedAt: Date | null; lastStatusChangedBy: string | null;
};

const pageSize = 25;
export const inquiryStatuses = ["RECEIVED", "IN_PROGRESS", "CONTACTED", "CLOSED"] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];
const allowedStatuses = new Set<string>(inquiryStatuses);
declare global { var scsCoreInquiryPool: Pool | undefined; }

function coreDatabaseURL() {
  const value = process.env.CORE_DATABASE_URL?.trim();
  if (!value) throw new Error("CORE_DATABASE_URL belum dikonfigurasi.");
  const url = new URL(value);
  if (!["postgres:", "postgresql:"].includes(url.protocol) || url.pathname !== "/scs_core") {
    throw new Error("CORE_DATABASE_URL harus mengarah ke database scs_core.");
  }
  return value;
}

function pool() {
  globalThis.scsCoreInquiryPool ??= new Pool({ connectionString: coreDatabaseURL(), max: 3, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000 });
  return globalThis.scsCoreInquiryPool;
}

const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

export function normalizeInquiryQuery(searchParams: Record<string, string | string[] | undefined> | undefined) {
  const query = first(searchParams?.q).trim().slice(0, 120);
  const requestedStatus = first(searchParams?.status).trim().toUpperCase();
  const status = allowedStatuses.has(requestedStatus) ? requestedStatus : "";
  const requestedPage = Number.parseInt(first(searchParams?.page), 10);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  return { query, status, page };
}

export async function listCoreInquiries(searchParams: Record<string, string | string[] | undefined> | undefined) {
  const filters = normalizeInquiryQuery(searchParams);
  if (!globalThis.scsCoreInquiryPool) {
    const localStore = await import("./local-inquiries");
    if (localStore.localInquiryStoreEnabled()) return localStore.listLocalInquiries(filters, pageSize);
  }
  const offset = (filters.page - 1) * pageSize;
  const values = [filters.query, filters.status];
  const where = `WHERE ($1 = '' OR CONCAT_WS(' ', i.public_reference, i.name, i.company, i.email, i.phone, i.interest_solution, i.message) ILIKE '%' || $1 || '%') AND ($2 = '' OR i.status = $2)`;
  const [records, count, totals] = await Promise.all([
    pool().query({
      text: `SELECT i.public_reference AS "publicReference", i.name, i.company, i.email, i.phone, i.message, i.interest_solution AS "interestSolution", i.source_page AS "sourcePage", i.preferred_contact AS "preferredContact", i.status, i.created_at AS "createdAt", audit.changed_at AS "lastStatusChangedAt", audit.changed_by_name AS "lastStatusChangedBy" FROM inquiries i LEFT JOIN LATERAL (SELECT changed_at, changed_by_name FROM inquiry_status_history h WHERE h.inquiry_public_reference = i.public_reference ORDER BY changed_at DESC, id DESC LIMIT 1) audit ON true ${where} ORDER BY i.created_at DESC LIMIT $3 OFFSET $4`,
      values: [...values, pageSize, offset],
    }),
    pool().query<{ total: string }>({ text: `SELECT COUNT(*)::text AS total FROM inquiries i ${where}`, values }),
    pool().query<{ status: string; total: string }>("SELECT status, COUNT(*)::text AS total FROM inquiries GROUP BY status"),
  ]);
  const total = Number(count.rows[0]?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const summary = { total: 0, RECEIVED: 0, IN_PROGRESS: 0, CONTACTED: 0, CLOSED: 0 };
  for (const row of totals.rows) {
    summary.total += Number(row.total);
    if (allowedStatuses.has(row.status)) summary[row.status as InquiryStatus] = Number(row.total);
  }
  return { summary, inquiries: records.rows as CoreInquiry[], total, page: Math.min(filters.page, totalPages), totalPages };
}

export async function updateCoreInquiryStatus(
  publicReference: string,
  nextStatus: InquiryStatus,
  actor: { id: number | string; name: string },
) {
  if (!globalThis.scsCoreInquiryPool) {
    const localStore = await import("./local-inquiries");
    if (localStore.localInquiryStoreEnabled()) return localStore.updateLocalInquiryStatus(publicReference, nextStatus, actor);
  }
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    const current = await client.query<{ status: string }>({
      text: "SELECT status FROM inquiries WHERE public_reference = $1 FOR UPDATE",
      values: [publicReference],
    });
    const previousStatus = current.rows[0]?.status;
    if (!previousStatus) {
      await client.query("ROLLBACK");
      return null;
    }
    if (previousStatus !== nextStatus) {
      await client.query({
        text: "UPDATE inquiries SET status = $2 WHERE public_reference = $1",
        values: [publicReference, nextStatus],
      });
      await client.query({
        text: `INSERT INTO inquiry_status_history (inquiry_public_reference, from_status, to_status, changed_by_user_id, changed_by_name) VALUES ($1, $2, $3, $4, $5)`,
        values: [publicReference, previousStatus, nextStatus, String(actor.id), actor.name],
      });
    }
    await client.query("COMMIT");
    return { publicReference, previousStatus, status: nextStatus, changed: previousStatus !== nextStatus };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
