import type { GlobalConfig } from "payload";

import { authenticated } from "../access";

const text = (name: string, label: string, defaultValue: string) => ({
  name,
  type: "text" as const,
  required: true,
  label,
  defaultValue,
});

const textarea = (name: string, label: string, defaultValue: string) => ({
  name,
  type: "textarea" as const,
  required: true,
  label,
  defaultValue,
});

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Pengaturan website",
  admin: {
    group: "Website",
    description: "Konten utama dan identitas yang digunakan langsung oleh landing page.",
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: "header",
      type: "group",
      label: "Header dan navigasi",
      fields: [
        text("aboutLabel", "Menu Tentang", "Tentang"),
        text("solutionsLabel", "Menu Solusi", "Solusi"),
        text("workflowLabel", "Menu Cara Kerja", "Cara Kerja"),
        text("projectsLabel", "Menu Proyek", "Proyek"),
        text("insightsLabel", "Menu Insight", "Insight"),
        text("ecosystemLabel", "Menu Ekosistem", "Ekosistem"),
        text("consultationLabel", "Tombol konsultasi", "Konsultasi"),
        text("menuEyebrow", "Label mega menu", "End-to-end capabilities"),
        text("menuTitle", "Judul mega menu", "Satu ekosistem untuk kebutuhan teknologi bisnis."),
        text("menuLinkLabel", "Tautan mega menu", "Lihat seluruh solusi"),
        text("mobileDetailLabel", "Label daftar solusi mobile", "Detail solusi"),
      ],
    },
    {
      name: "hero",
      type: "group",
      label: "Hero landing page",
      fields: [
        { name: "eyebrow", type: "text", required: true, label: "Label kecil" },
        { name: "headline", type: "text", required: true, label: "Headline" },
        { name: "highlight", type: "text", required: true, label: "Headline aksen" },
        { name: "description", type: "textarea", required: true, label: "Deskripsi" },
        { name: "image", type: "upload", relationTo: "media", label: "Gambar latar hero" },
        text("imageAlt", "Teks alternatif gambar", "Kota digital yang saling terhubung"),
        text("primaryButtonLabel", "Tombol utama", "Diskusikan kebutuhan"),
        text("secondaryButtonLabel", "Tombol kedua", "Jelajahi solusi"),
        text("proofOne", "Nilai utama 1", "Reliable"),
        text("proofTwo", "Nilai utama 2", "Secure"),
        text("proofThree", "Nilai utama 3", "Scalable"),
        text("proofFour", "Nilai utama 4", "Customer-focused"),
      ],
    },
    {
      name: "solutionsSection",
      type: "group",
      label: "Bagian solusi",
      admin: { description: "Judul dan label pada bagian kartu solusi. Isi masing-masing kartu dikelola melalui menu Solusi." },
      fields: [
        text("eyebrow", "Label kecil", "What we do"),
        text("title", "Judul bagian", "Solusi menyeluruh untuk setiap lapisan teknologi."),
        textarea("description", "Deskripsi", "Dari infrastruktur hingga keamanan, dari cloud hingga managed services—semua dirancang untuk bekerja bersama."),
        text("cardLinkLabel", "Label tautan kartu", "Lihat detail solusi"),
        textarea("emptyMessage", "Pesan saat belum ada solusi", "Informasi solusi sedang diperbarui. Tim kami tetap siap membantu kebutuhan teknologi Anda."),
        text("emptyButtonLabel", "Tombol saat belum ada solusi", "Hubungi tim SCS"),
      ],
    },
    {
      name: "projectsSection",
      type: "group",
      label: "Bagian proyek pilihan",
      fields: [
        text("eyebrow", "Label kecil", "Selected projects"),
        text("title", "Judul bagian", "Implementasi yang memberi dampak nyata."),
        textarea("description", "Deskripsi", "Beberapa solusi yang kami rancang untuk menjawab kebutuhan operasional dan pertumbuhan bisnis."),
        text("linkLabel", "Tautan seluruh proyek", "Lihat seluruh proyek"),
        text("confidentialLabel", "Label klien rahasia", "Confidential client"),
      ],
    },
    {
      name: "ecosystemSection",
      type: "group",
      label: "Bagian ekosistem partner",
      fields: [
        text("eyebrow", "Label kecil", "Technology ecosystem"),
        text("title", "Judul bagian", "Bekerja dengan teknologi terdepan."),
        textarea("description", "Deskripsi", "Kami merancang solusi menggunakan ekosistem teknologi enterprise yang sudah teruji."),
      ],
    },
    {
      name: "insightsSection",
      type: "group",
      label: "Bagian insight terbaru",
      fields: [
        text("eyebrow", "Label kecil", "Latest insight"),
        text("title", "Judul bagian", "Perspektif untuk keputusan teknologi yang lebih baik."),
        textarea("description", "Deskripsi", "Insight terbaru dari tim SCS seputar infrastruktur, keamanan, cloud, dan transformasi digital."),
        text("linkLabel", "Tautan seluruh insight", "Baca seluruh insight"),
      ],
    },
    {
      name: "contact",
      type: "group",
      label: "Kontak perusahaan",
      fields: [
        { name: "email", type: "email", required: true, label: "Email" },
        { name: "phone", type: "text", required: true, label: "Telepon" },
        { name: "address", type: "textarea", required: true, label: "Alamat" },
      ],
    },
    {
      name: "consultation",
      type: "group",
      label: "Ajakan konsultasi",
      admin: {
        description: "Teks di sisi kiri formulir konsultasi pada landing page.",
      },
      fields: [
        { name: "eyebrow", type: "text", required: true, label: "Label kecil", defaultValue: "Let's build what's next" },
        { name: "headline", type: "text", required: true, label: "Judul", defaultValue: "Siap membangun fondasi teknologi berikutnya?" },
        { name: "description", type: "textarea", required: true, label: "Deskripsi", defaultValue: "Ceritakan kebutuhan infrastruktur dan sistem Anda. Tim kami siap membantu menyusun solusi yang tepat." },
      ],
    },
    {
      name: "contactForm",
      type: "group",
      label: "Form konsultasi",
      fields: [
        text("submitLabel", "Tombol kirim", "Kirim konsultasi"),
        text("privacyText", "Keterangan privasi", "Data Anda hanya digunakan untuk menindaklanjuti kebutuhan konsultasi."),
        text("unknownSolutionLabel", "Pilihan tanpa solusi", "Belum menentukan solusi"),
      ],
    },
    {
      name: "whatsapp",
      type: "group",
      label: "Tombol WhatsApp",
      fields: [
        text("eyebrow", "Label kecil", "Butuh bantuan?"),
        text("label", "Label tombol", "Hubungi Kami"),
        textarea("message", "Pesan awal WhatsApp", "Halo PT Sigma Core Solusindo, saya ingin berkonsultasi mengenai solusi IT untuk perusahaan kami."),
      ],
    },
    {
      name: "footer",
      type: "group",
      label: "Footer",
      fields: [
        textarea("tagline", "Tagline", "Partner teknologi untuk bisnis yang terus bertumbuh. Terintegrasi, aman, dan siap melaju."),
        text("ctaLabel", "Tombol kontak", "Hubungi Kami"),
        text("navigationTitle", "Judul navigasi", "Jelajahi"),
        text("contactTitle", "Judul kontak", "Kontak & lokasi"),
        text("backToTopLabel", "Tautan kembali ke atas", "Kembali ke atas"),
        text("copyright", "Teks hak cipta", "PT Sigma Core Solusindo. All rights reserved."),
      ],
    },
    {
      name: "companyFacts",
      type: "array",
      label: "Company facts",
      maxRows: 4,
      admin: {
        description: "Gunakan hanya angka atau fakta perusahaan yang sudah dapat diverifikasi.",
      },
      fields: [
        { name: "value", type: "text", required: true, label: "Nilai", admin: { width: "30%" } },
        { name: "label", type: "text", required: true, label: "Keterangan", admin: { width: "70%" } },
      ],
    },
    {
      name: "seo",
      type: "group",
      label: "SEO & share preview",
      fields: [
        { name: "title", type: "text", required: true, label: "Judul halaman" },
        { name: "description", type: "textarea", required: true, label: "Meta description" },
      ],
    },
  ],
};
