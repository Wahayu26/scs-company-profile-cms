import Link from "next/link";
import { Building2, CalendarDays, ChevronLeft, ChevronRight, Inbox, Mail, Phone, Search } from "lucide-react";
import { DefaultTemplate } from "@payloadcms/next/templates";
import { SetStepNav } from "@payloadcms/ui";
import type { AdminViewServerProps } from "payload";
import { inquiryStatuses, listCoreInquiries, normalizeInquiryQuery, type InquiryStatus } from "../core-inquiries";
import { requireCMSAdmin } from "../require-admin";
import InquiryStatusControl from "./InquiryStatusControl";

const labels: Record<InquiryStatus, string> = { RECEIVED: "Baru", IN_PROGRESS: "Diproses", CONTACTED: "Sudah dihubungi", CLOSED: "Selesai" };
function href(page: number, query: string, status: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (status) params.set("status", status);
  if (page > 1) params.set("page", String(page));
  return "/admin/consultations" + (params.size ? "?" + params.toString() : "");
}

export default async function ConsultationsView(props: AdminViewServerProps) {
  const { initPageResult, searchParams } = props;
  requireCMSAdmin(initPageResult);
  const filters = normalizeInquiryQuery(searchParams);
  let result: Awaited<ReturnType<typeof listCoreInquiries>> | null = null;
  try { result = await listCoreInquiries(searchParams); } catch { /* Render an honest unavailable state without replacing real records. */ }
  return <DefaultTemplate i18n={props.i18n} locale={initPageResult.locale} params={props.params} payload={props.payload} permissions={initPageResult.permissions} req={initPageResult.req} searchParams={searchParams} user={initPageResult.req.user ?? undefined} viewActions={props.viewActions} viewType={props.viewType} visibleEntities={initPageResult.visibleEntities}>
    <SetStepNav nav={[{ label: "Konsultasi Masuk" }]} />
    <main className="scs-inbox">
      <header className="scs-inbox__heading"><h1>Konsultasi Masuk</h1><p>Kelola permintaan konsultasi dari website.</p></header>
      <section className="scs-inbox__stats" aria-label="Ringkasan konsultasi">
        <div className="scs-inbox__stat"><strong>{result?.summary.total ?? "—"}</strong><span>Total Konsultasi</span></div>
        {inquiryStatuses.map(status => <Link href={href(1, "", status)} key={status} className={"scs-inbox__stat status-" + status}><strong>{result?.summary[status] ?? "—"}</strong><span>{labels[status]}</span></Link>)}
      </section>
      <form className="scs-inbox__filters" method="get">
        <label className="scs-inbox__search"><Search size={19} aria-hidden="true" /><input type="search" name="q" defaultValue={filters.query} aria-label="Cari konsultasi" placeholder="Cari nama, perusahaan, email, atau kebutuhan…" /><button type="submit" name="status" value={filters.status}>Cari</button></label>
        <div className="scs-inbox__tabs" aria-label="Filter status">
          {[["", "Semua"], ...Object.entries(labels)].map(([status, label]) => <button key={status} type="submit" name="status" value={status} aria-pressed={filters.status === status}>{label}</button>)}
        </div>
      </form>
      {result ? <>
        <div className="scs-inbox__results"><span>Menampilkan <strong>{result.inquiries.length}</strong> dari <strong>{result.total}</strong> konsultasi{filters.query ? " sesuai pencarian" : ""}</span></div>
        <div className="scs-inbox__cards">
          {result.inquiries.map(inquiry => {
            const status = inquiryStatuses.includes(inquiry.status as InquiryStatus) ? inquiry.status as InquiryStatus : "RECEIVED";
            const initials = inquiry.name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase();
            return <article className={"scs-inbox__card status-" + status} key={inquiry.publicReference}>
              <div className="scs-inbox__initials" aria-hidden="true">{initials}</div>
              <div className="scs-inbox__body">
                <div className="scs-inbox__card-heading"><div><h2>{inquiry.name}</h2><h3>{inquiry.interestSolution || "Konsultasi umum"}</h3></div><div className="scs-inbox__meta"><span className="scs-inbox__badge">{labels[status]}</span><time dateTime={inquiry.createdAt.toISOString()}><CalendarDays size={14} />{new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Jakarta" }).format(inquiry.createdAt)}</time></div></div>
                <div className="scs-inbox__contact"><span><Building2 size={15} />{inquiry.company}</span><a href={"mailto:" + inquiry.email}><Mail size={15} />{inquiry.email}</a>{inquiry.phone && <a href={"tel:" + inquiry.phone.replace(/[^+\d]/g, "")}><Phone size={15} />{inquiry.phone}</a>}</div>
                <p className="scs-inbox__message">{inquiry.message}</p>
                <div className="scs-inbox__update"><span>Update status:</span><InquiryStatusControl key={inquiry.publicReference + status} currentStatus={status} lastChangedAt={inquiry.lastStatusChangedAt?.toISOString() ?? null} lastChangedBy={inquiry.lastStatusChangedBy} publicReference={inquiry.publicReference} /></div>
                <details className="scs-inbox__details"><summary>Detail permintaan</summary><dl><dt>Referensi</dt><dd>{inquiry.publicReference}</dd><dt>Preferensi kontak</dt><dd>{inquiry.preferredContact || "Belum ditentukan"}</dd>{inquiry.sourcePage && <><dt>Halaman sumber</dt><dd>{inquiry.sourcePage}</dd></>}</dl></details>
              </div>
            </article>;
          })}
        </div>
        {!result.inquiries.length && <section className="scs-inquiries__empty"><Inbox size={28} /><h2>Belum ada hasil</h2><p>Belum ada konsultasi yang sesuai dengan filter ini.</p></section>}
        {result.totalPages > 1 && <nav className="scs-inquiries__pagination" aria-label="Halaman konsultasi">{result.page > 1 ? <Link href={href(result.page - 1, filters.query, filters.status)}><ChevronLeft size={16} /> Sebelumnya</Link> : <span />}<span>Halaman {result.page} dari {result.totalPages}</span>{result.page < result.totalPages && <Link href={href(result.page + 1, filters.query, filters.status)}>Berikutnya <ChevronRight size={16} /></Link>}</nav>}
      </> : <section className="scs-inquiries__empty"><Inbox size={28} /><h2>Konsultasi belum dapat dimuat</h2><p>Periksa koneksi server CMS ke database Core API.</p></section>}
    </main>
  </DefaultTemplate>;
}
