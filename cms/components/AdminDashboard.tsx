/* scs-auth-repair-v1 */
import { requireCMSUser } from '../require-admin';
/* scs-content-workflow-v1 */
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  Building2,
  CircleCheck,
  CircleDashed,
  Eye,
  ImageIcon,
  LayoutTemplate,
  Plus,
  Settings2,
  Sparkles,
} from "lucide-react";
import type { AdminViewServerProps } from "payload";

type Stat = {
  label: string;
  total: number;
  published: number;
  href: string;
  icon: typeof BriefcaseBusiness;
};

const quickActions = [
  { label: "Tambah solusi", href: "/admin/collections/solutions/create", icon: Plus },
  { label: "Tambah proyek", href: "/admin/collections/projects/create", icon: BriefcaseBusiness },
  { label: "Tulis insight", href: "/admin/collections/insights/create", icon: BookOpenText },
  { label: "Upload media", href: "/admin/collections/media/create", icon: ImageIcon },
];

export default async function AdminDashboard({ initPageResult }: AdminViewServerProps) {
  const user = requireCMSUser(initPageResult);
  const req = initPageResult.req;
  const payload = req.payload;

  const [solutions, publishedSolutions, partners, publishedPartners, projects, publishedProjects, insights, publishedInsights, media] =
    await Promise.all([
      payload.count({ req, overrideAccess: false, collection: "solutions" }),
      payload.count({ req, overrideAccess: false, collection: "solutions", where: { published: { equals: true }, _status: { equals: "published" } } }),
      payload.count({ req, overrideAccess: false, collection: "partners" }),
      payload.count({ req, overrideAccess: false, collection: "partners", where: { published: { equals: true }, _status: { equals: "published" } } }),
      payload.count({ req, overrideAccess: false, collection: "projects" }),
      payload.count({ req, overrideAccess: false, collection: "projects", where: { published: { equals: true }, _status: { equals: "published" } } }),
      payload.count({ req, overrideAccess: false, collection: "insights" }),
      payload.count({ req, overrideAccess: false, collection: "insights", where: { published: { equals: true }, _status: { equals: "published" } } }),
      payload.count({ req, overrideAccess: false, collection: "media" }),
    ]);

  const stats: Stat[] = [
    { label: "Solusi", total: solutions.totalDocs, published: publishedSolutions.totalDocs, href: "/admin/collections/solutions", icon: LayoutTemplate },
    { label: "Partner", total: partners.totalDocs, published: publishedPartners.totalDocs, href: "/admin/collections/partners", icon: Building2 },
    { label: "Proyek", total: projects.totalDocs, published: publishedProjects.totalDocs, href: "/admin/collections/projects", icon: BriefcaseBusiness },
    { label: "Insight", total: insights.totalDocs, published: publishedInsights.totalDocs, href: "/admin/collections/insights", icon: BookOpenText },
  ];

  const completionItems = [
    { label: "Solusi telah dipublikasikan", done: publishedSolutions.totalDocs >= 3 },
    { label: "Logo partner telah ditambahkan", done: publishedPartners.totalDocs >= 6 },
    { label: "Proyek unggulan siap ditampilkan", done: publishedProjects.totalDocs >= 1 },
    { label: "Insight pertama telah terbit", done: publishedInsights.totalDocs >= 1 },
    { label: "Pustaka media terisi", done: media.totalDocs >= 1 },
  ];
  const completed = completionItems.filter((item) => item.done).length;
  const completion = Math.round((completed / completionItems.length) * 100);

  return (
    <div className="scs-dashboard">
      <section className="scs-dashboard__welcome">
        <div>
          <p className="scs-dashboard__eyebrow"><Sparkles size={15} /> Sigma Core Content Hub</p>
          <h1>Selamat datang, {user?.name?.split(" ")[0] || "Editor"}.</h1>
          <p>Kelola seluruh konten website dan pantau kesiapan publikasinya dari satu tempat.</p>
        </div>
        <Link className="scs-dashboard__preview" href={process.env.WEBSITE_URL || "http://localhost:3000"} target="_blank" rel="noopener noreferrer">
          <Eye size={17} /> Lihat website <ArrowUpRight size={16} />
        </Link>
      </section>

      <section className="scs-dashboard__stats" aria-label="Ringkasan konten">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link href={stat.href} className="scs-stat-card" key={stat.label}>
              <span className="scs-stat-card__icon"><Icon size={20} /></span>
              <span className="scs-stat-card__count">{stat.total}</span>
              <span className="scs-stat-card__label">{stat.label}</span>
              <span className="scs-stat-card__status"><i /> {stat.published} tayang</span>
              <ArrowUpRight className="scs-stat-card__arrow" size={17} />
            </Link>
          );
        })}
      </section>

      <div className="scs-dashboard__grid">
        <section className="scs-dashboard__panel">
          <div className="scs-dashboard__panel-heading">
            <div><span className="scs-panel-icon"><Plus size={18} /></span><div><h2>Aksi cepat</h2><p>Mulai pekerjaan yang paling sering dilakukan.</p></div></div>
          </div>
          <div className="scs-quick-actions">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return <Link href={action.href} key={action.href}><Icon size={18} /><span>{action.label}</span><ArrowUpRight size={15} /></Link>;
            })}
          </div>
        </section>

        <section className="scs-dashboard__panel scs-dashboard__readiness">
          <div className="scs-dashboard__panel-heading">
            <div><span className="scs-panel-icon cyan"><BarChart3 size={18} /></span><div><h2>Kesiapan konten</h2><p>Checklist minimum untuk landing page.</p></div></div>
            <strong>{completion}%</strong>
          </div>
          <div className="scs-progress"><span style={{ width: `${completion}%` }} /></div>
          <div className="scs-checklist">
            {completionItems.map((item) => (
              <div className={item.done ? "done" : ""} key={item.label}>
                {item.done ? <CircleCheck size={17} /> : <CircleDashed size={17} />}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="scs-dashboard__settings">
        <div><span className="scs-panel-icon orange"><Settings2 size={18} /></span><div><h2>Identitas dan informasi website</h2><p>Perbarui headline hero, kontak perusahaan, dan metadata SEO tanpa mengubah kode.</p></div></div>
        <Link href="/admin/globals/site-settings">Buka pengaturan <ArrowUpRight size={16} /></Link>
      </section>
    </div>
  );
}
