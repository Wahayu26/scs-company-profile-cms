import type { GlobalConfig } from "payload";

import { authenticated } from "../access";

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
      name: "hero",
      type: "group",
      label: "Hero landing page",
      fields: [
        { name: "eyebrow", type: "text", required: true, label: "Label kecil" },
        { name: "headline", type: "text", required: true, label: "Headline" },
        { name: "highlight", type: "text", required: true, label: "Headline aksen" },
        { name: "description", type: "textarea", required: true, label: "Deskripsi" },
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
