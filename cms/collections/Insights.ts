import type { CollectionConfig } from "payload";

import { authenticated, authenticatedOrPublished } from "../access";

export const Insights: CollectionConfig = {
  slug: "insights",
  labels: {
    singular: "Insight",
    plural: "Insight",
  },
  admin: {
    group: "Konten Website",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "featured", "published"],
    description: "Kelola artikel, berita perusahaan, dan edukasi teknologi untuk landing page.",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultSort: "-publishedAt",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Judul",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Slug URL",
      admin: {
        description: "Gunakan huruf kecil dan tanda hubung.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "category",
          type: "select",
          required: true,
          defaultValue: "insight",
          label: "Kategori",
          admin: { width: "50%" },
          options: [
            { label: "Insight teknologi", value: "insight" },
            { label: "Berita perusahaan", value: "news" },
            { label: "Panduan", value: "guide" },
          ],
        },
        {
          name: "publishedAt",
          type: "date",
          required: true,
          defaultValue: () => new Date().toISOString(),
          label: "Tanggal publikasi",
          admin: {
            width: "50%",
            date: { pickerAppearance: "dayAndTime" },
          },
        },
      ],
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      label: "Ringkasan artikel",
      maxLength: 220,
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "Gambar sampul",
    },
    {
      name: "content",
      type: "richText",
      required: true,
      label: "Isi artikel",
    },
    {
      name: "relatedSolutions",
      type: "relationship",
      relationTo: "solutions",
      hasMany: true,
      label: "Solusi terkait",
    },
    {
      name: "seo",
      type: "group",
      label: "SEO artikel",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Meta title",
          admin: { description: "Opsional—judul artikel akan digunakan jika dikosongkan." },
        },
        {
          name: "description",
          type: "textarea",
          label: "Meta description",
          admin: { description: "Opsional—ringkasan artikel akan digunakan jika dikosongkan." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
          required: true,
          label: "Insight unggulan",
          admin: { width: "50%" },
        },
        {
          name: "published",
          type: "checkbox",
          defaultValue: false,
          required: true,
          label: "Tayang di website",
          admin: { width: "50%" },
        },
      ],
    },
  ],
};
