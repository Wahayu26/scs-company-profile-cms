import type { CollectionConfig } from "payload";

import { authenticated, authenticatedOrPublished } from "../access";

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: {
    singular: "Proyek",
    plural: "Proyek",
  },
  admin: {
    group: "Konten Website",
    useAsTitle: "title",
    defaultColumns: ["order", "title", "industry", "featured", "published"],
    description: "Tampilkan implementasi dan keberhasilan proyek SCS di landing page.",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultSort: "order",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Nama proyek",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Slug URL",
      admin: {
        description: "Gunakan huruf kecil dan tanda hubung, contoh: modernisasi-data-center.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "industry",
          type: "text",
          required: true,
          label: "Industri",
          admin: { width: "50%" },
        },
        {
          name: "client",
          type: "text",
          label: "Nama klien",
          admin: {
            width: "50%",
            description: "Opsional—kosongkan bila informasi bersifat rahasia.",
          },
        },
      ],
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      label: "Ringkasan",
      maxLength: 260,
    },
    {
      name: "highlights",
      type: "array",
      label: "Hasil utama",
      maxRows: 3,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Poin hasil",
        },
      ],
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Tantangan",
          fields: [
            {
              name: "challenge",
              type: "richText",
              label: "Kondisi dan tantangan",
            },
          ],
        },
        {
          label: "Solusi",
          fields: [
            {
              name: "solution",
              type: "richText",
              label: "Pendekatan dan implementasi",
            },
          ],
        },
        {
          label: "Hasil",
          fields: [
            {
              name: "result",
              type: "richText",
              label: "Hasil dan dampak",
            },
          ],
        },
      ],
    },
    {
      name: "technologies",
      type: "array",
      label: "Teknologi yang digunakan",
      maxRows: 12,
      fields: [
        { name: "label", type: "text", required: true, label: "Teknologi" },
      ],
    },
    {
      name: "relatedSolutions",
      type: "relationship",
      relationTo: "solutions",
      hasMany: true,
      label: "Solusi terkait",
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "Gambar sampul",
    },
    {
      type: "row",
      fields: [
        {
          name: "order",
          type: "number",
          defaultValue: 0,
          required: true,
          index: true,
          label: "Urutan",
          admin: { width: "33%" },
        },
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
          required: true,
          label: "Proyek unggulan",
          admin: { width: "33%" },
        },
        {
          name: "published",
          type: "checkbox",
          defaultValue: false,
          required: true,
          label: "Tayang di website",
          admin: { width: "33%" },
        },
      ],
    },
  ],
};
