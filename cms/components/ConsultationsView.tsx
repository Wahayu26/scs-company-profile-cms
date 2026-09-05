import Link from "next/link";
import { ChevronLeft, ChevronRight, Inbox, Mail, Phone, Search } from "lucide-react";
import type { AdminViewServerProps } from "payload";

import { listCoreInquiries, normalizeInquiryQuery } from "../core-inquiries";
import { requireCMSAdmin } from "../require-admin";

const dateTime = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });
const statusLabels: Record<string, string> = { RECEIVED: "Baru", IN_PROGRESS: "Diproses", CONTACTED: "Sudah dihubungi", CLOSED: "Selesai" };

function pageHref(page: number, query: string, status: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (status) params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const suffix = params.toString();
  return `/admin/consultations${suffix ? `?${suffix}` : ""}`;
}

export default async function ConsultationsView({ initPageResult, searchParams }: AdminViewServerProps) {
  requireCMSAdmin(initPageResult);
  const filters = normalizeInquiryQuery(searchParams);
  try {
    const result = await listCoreInquiries(searchParams);
    return <main className="scs-inquiries">
      <header className="scs-inquiries__header">
        <div><p><Inbox size={16} /> Customer inquiry</p><h1>Konsultasi Masuk</h1><span>Permintaan konsultasi yang dikirim melalui landing page.</span></div>
        <strong>{result.total}<small>Total konsultasi</small></strong>
      </header>

      <form className="scs-inquiries__filters" method="get">
        <label><Search size={17} /><input name="q" defaultValue={filters.query} placeholder="Cari referensi, nama, perusahaan, atau email" /></label>
        <select name="status" defaultValue={filters.status} aria-label="Filter status"><option value="">Semua status</option>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>
        <button type="submit">Terapkan filter</button>
      </form>

      {result.inquiries.length ? <div className="scs-inquiries__table-wrap"><table className="scs-inquiries__table">
        <thead><tr><th>Kontak</th><th>Kebutuhan</th><th>Preferensi</th><th>Status</th><th>Diterima</th></tr></thead>
        <tbody>{result.inquiries.map((inquiry) => <tr key={inquiry.publicReference}>
          <td><strong>{inquiry.name}</strong><span>{inquiry.company}</span><code>{inquiry.publicReference}</code><div><a href={`mailto:${inquiry.email}`}><Mail size={14} />{inquiry.email}</a>{inquiry.phone && <a href={`tel:${inquiry.phone.replace(/[^+\d]/g, "")}`}><Phone size={14} />{inquiry.phone}</a>}</div></td>
          <td><strong>{inquiry.interestSolution || "Belum menentukan"}</strong><details><summary>Lihat pesan</summary><p>{inquiry.message}</p></details>{inquiry.sourcePage && <small>Sumber: {inquiry.sourcePage}</small>}</td>
          <td>{inquiry.preferredContact || "—"}</td>
          <td><span className={`scs-inquiry-status ${inquiry.status.toLowerCase()}`}>{statusLabels[inquiry.status] || inquiry.status}</span></td>
          <td><time dateTime={inquiry.createdAt.toISOString()}>{dateTime.format(inquiry.createdAt)}</time></td>
        </tr>)}</tbody>
      </table></div> : <section className="scs-inquiries__empty"><Inbox size={28} /><h2>Belum ada hasil</h2><p>Belum ada konsultasi yang sesuai dengan filter ini.</p></section>}

      {result.totalPages > 1 && <nav className="scs-inquiries__pagination" aria-label="Halaman konsultasi">
        {result.page > 1 ? <Link href={pageHref(result.page - 1, filters.query, filters.status)}><ChevronLeft size={16} /> Sebelumnya</Link> : <span />}
        <span>Halaman {result.page} dari {result.totalPages}</span>
        {result.page < result.totalPages && <Link href={pageHref(result.page + 1, filters.query, filters.status)}>Berikutnya <ChevronRight size={16} /></Link>}
      </nav>}
    </main>;
  } catch {
    return <main className="scs-inquiries"><section className="scs-inquiries__empty error"><Inbox size={28} /><h1>Konsultasi belum dapat dimuat</h1><p>Periksa koneksi server CMS ke database Core API.</p></section></main>;
  }
}
