import { Pool } from "pg";

export type CoreInquiry = {
  publicReference: string; name: string; company: string; email: string; phone: string | null;
  message: string; interestSolution: string | null; sourcePage: string | null;
  preferredContact: string | null; status: string; createdAt: Date;
};

const pageSize = 25;
const allowedStatuses = new Set(["RECEIVED", "IN_PROGRESS", "CONTACTED", "CLOSED"]);
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
  const offset = (filters.page - 1) * pageSize;
  const values = [filters.query, filters.status];
  const where = `WHERE ($1 = '' OR CONCAT_WS(' ', public_reference, name, company, email, phone, message) ILIKE '%' || $1 || '%') AND ($2 = '' OR status = $2)`;
  const [records, count] = await Promise.all([
    pool().query({
      text: `SELECT public_reference AS "publicReference", name, company, email, phone, message, interest_solution AS "interestSolution", source_page AS "sourcePage", preferred_contact AS "preferredContact", status, created_at AS "createdAt" FROM inquiries ${where} ORDER BY created_at DESC LIMIT $3 OFFSET $4`,
      values: [...values, pageSize, offset],
    }),
    pool().query<{ total: string }>({ text: `SELECT COUNT(*)::text AS total FROM inquiries ${where}`, values }),
  ]);
  const total = Number(count.rows[0]?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return { inquiries: records.rows as CoreInquiry[], total, page: Math.min(filters.page, totalPages), totalPages };
}
