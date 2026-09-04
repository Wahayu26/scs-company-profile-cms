import { CreateFirstUserView } from "@payloadcms/next/views";
import { Gauge, Layers3, ShieldCheck } from "lucide-react";
import type { AdminViewServerProps } from "payload";

const benefits = [
  {
    icon: Layers3,
    title: "Konten terpusat",
    description: "Kelola solusi, partner, media, dan informasi website dalam satu ruang kerja.",
  },
  {
    icon: ShieldCheck,
    title: "Akses terlindungi",
    description: "Akun pertama menjadi administrator utama untuk pengelolaan akses berikutnya.",
  },
  {
    icon: Gauge,
    title: "Publikasi lebih cepat",
    description: "Perbarui konten company profile tanpa mengubah source code website.",
  },
];

export default async function BrandedCreateFirstUser(props: AdminViewServerProps) {
  return (
    <main className="scs-first-user">
      <section className="scs-first-user__brand" aria-label="Tentang Sigma Core CMS">
        <img
          className="scs-first-user__backdrop"
          src="/assets/server-room.jpg"
          alt=""
          aria-hidden="true"
        />
        <div className="scs-first-user__brand-overlay" />

        <div className="scs-first-user__brand-content">
          <a className="scs-first-user__logo" href="/" aria-label="Kembali ke website Sigma Core">
            <img src="/assets/scs-logo.png" alt="PT Sigma Core Solusindo" />
          </a>

          <div className="scs-first-user__brand-copy">
            <p className="scs-first-user__eyebrow"><span /> SCS Content Operations</p>
            <h2>Satu akun untuk mengelola seluruh cerita digital SCS.</h2>
            <p>
              Ruang kerja aman untuk menjaga informasi perusahaan tetap relevan, konsisten,
              dan siap dipublikasikan.
            </p>
          </div>

          <div className="scs-first-user__benefits">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article key={title}>
                <span className="scs-first-user__benefit-icon"><Icon size={19} /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="scs-first-user__secure-note">
            <ShieldCheck size={15} /> Secure onboarding · Internal access only
          </p>
        </div>
      </section>

      <section className="scs-first-user__form-panel">
        <div className="scs-first-user__form-shell">
          <a className="scs-first-user__mobile-logo" href="/" aria-label="Kembali ke website Sigma Core">
            <img src="/assets/scs-logo.png" alt="PT Sigma Core Solusindo" />
          </a>

          <header className="scs-first-user__form-header">
            <p className="scs-first-user__step">Langkah 1 dari 1 · Initial setup</p>
            <h1>Buat akun administrator</h1>
            <p>
              Lengkapi informasi berikut untuk mengaktifkan dashboard pengelolaan website SCS.
            </p>
          </header>

          <div className="scs-first-user__payload-form">
            <CreateFirstUserView {...props} />
          </div>

          <div className="scs-first-user__password-hint">
            <ShieldCheck size={17} />
            <p><strong>Gunakan password yang kuat.</strong> Kombinasikan huruf besar, huruf kecil, angka, dan simbol.</p>
          </div>

          <p className="scs-first-user__support">
            Butuh bantuan? Hubungi <a href="mailto:admin@sigmacore.id">admin@sigmacore.id</a>
          </p>
        </div>
      </section>
    </main>
  );
}
