import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import type { CoreInquiry, InquiryStatus } from "./core-inquiries";

type InquiryInput = {
  name: string;
  company: string;
  email: string;
  phone: string | null;
  message: string;
  interestSolution: string | null;
  sourcePage: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  preferredContact: string;
};

type LocalRow = {
  public_reference: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  message: string;
  interest_solution: string | null;
  source_page: string | null;
  preferred_contact: string | null;
  status: string;
  created_at: string;
  last_status_changed_at: string | null;
  last_status_changed_by: string | null;
};

let database: DatabaseSync | undefined;

export function localInquiryStoreEnabled() {
  return !process.env.CORE_DATABASE_URL?.trim() && process.env.PAYLOAD_DB_PROVIDER !== "postgres";
}

function db() {
  if (!localInquiryStoreEnabled()) throw new Error("Penyimpanan konsultasi lokal tidak aktif.");
  if (database) return database;
  const filename = path.resolve(process.cwd(), process.env.LOCAL_INQUIRY_DB ?? ".data/inquiries.db");
  mkdirSync(path.dirname(filename), { recursive: true });
  database = new DatabaseSync(filename);
  database.exec("PRAGMA journal_mode = WAL");
  database.exec(`CREATE TABLE IF NOT EXISTS inquiries (
    public_reference TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    interest_solution TEXT,
    source_page TEXT,
    utm_source TEXT,
    utm_campaign TEXT,
    preferred_contact TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'RECEIVED',
    created_at TEXT NOT NULL,
    last_status_changed_at TEXT,
    last_status_changed_by TEXT
  )`);
  return database;
}

function reference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `SCS-${date}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export function createLocalInquiry(input: InquiryInput) {
  const publicReference = reference();
  db().prepare(`INSERT INTO inquiries (
    public_reference, name, company, email, phone, message, interest_solution,
    source_page, utm_source, utm_campaign, preferred_contact, status, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'RECEIVED', ?)`)
    .run(publicReference, input.name, input.company, input.email, input.phone, input.message,
      input.interestSolution, input.sourcePage, input.utmSource, input.utmCampaign,
      input.preferredContact, new Date().toISOString());
  return publicReference;
}

const mapRow = (item: LocalRow): CoreInquiry => ({
  publicReference: item.public_reference,
  name: item.name,
  company: item.company,
  email: item.email,
  phone: item.phone,
  message: item.message,
  interestSolution: item.interest_solution,
  sourcePage: item.source_page,
  preferredContact: item.preferred_contact,
  status: item.status,
  createdAt: new Date(item.created_at),
  lastStatusChangedAt: item.last_status_changed_at ? new Date(item.last_status_changed_at) : null,
  lastStatusChangedBy: item.last_status_changed_by,
});

export function listLocalInquiries(filters: { query: string; status: string; page: number }, pageSize: number) {
  const search = `%${filters.query}%`;
  const where = `WHERE (? = '' OR public_reference || ' ' || name || ' ' || company || ' ' || email || ' ' || COALESCE(phone, '') || ' ' || COALESCE(interest_solution, '') || ' ' || message LIKE ? COLLATE NOCASE) AND (? = '' OR status = ?)`;
  const args = [filters.query, search, filters.status, filters.status];
  const total = Number((db().prepare(`SELECT COUNT(*) AS total FROM inquiries ${where}`).get(...args) as { total: number }).total);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(filters.page, totalPages);
  const records = db().prepare(`SELECT * FROM inquiries ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .all(...args, pageSize, (page - 1) * pageSize) as unknown as LocalRow[];
  const summary = { total: 0, RECEIVED: 0, IN_PROGRESS: 0, CONTACTED: 0, CLOSED: 0 };
  for (const item of db().prepare("SELECT status, COUNT(*) AS total FROM inquiries GROUP BY status").all() as unknown as { status: string; total: number }[]) {
    summary.total += Number(item.total);
    if (item.status in summary && item.status !== "total") summary[item.status as InquiryStatus] = Number(item.total);
  }
  return { summary, inquiries: records.map(mapRow), total, page, totalPages };
}

export function updateLocalInquiryStatus(publicReference: string, status: InquiryStatus, actor: { name: string }) {
  const current = db().prepare("SELECT status FROM inquiries WHERE public_reference = ?").get(publicReference) as { status: string } | undefined;
  if (!current) return null;
  const changed = current.status !== status;
  if (changed) db().prepare("UPDATE inquiries SET status = ?, last_status_changed_at = ?, last_status_changed_by = ? WHERE public_reference = ?")
    .run(status, new Date().toISOString(), actor.name, publicReference);
  return { publicReference, previousStatus: current.status, status, changed };
}
