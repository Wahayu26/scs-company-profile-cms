import type { CollectionConfig } from "payload";

import { authenticated, authenticatedOrPublished } from "../access";

export const Solutions: CollectionConfig = {
  slug: "solutions",
  labels: {
    singular: "Solusi",
    plural: "Solusi",
  },
  admin: {
    group: "Konten Website",
    useAsTitle: "title",
    defaultColumns: ["order", "title", "published", "updatedAt"],
    description: "Kelola layanan dan solusi utama yang ditampilkan di landing page.",
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
      label: "Judul solusi",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      label: "Slug URL",
      unique: true,
      index: true,
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      label: "Ringkasan",
    },
    {
      type: "row",
      fields: [
        {
          name: "category",
          type: "select",
          required: true,
          defaultValue: "platform",
          label: "Kelompok solusi",
          admin: { width: "50%" },
          options: [
            { label: "Platform & Infrastructure", value: "platform" },
            { label: "Connectivity & Protection", value: "protection" },
            { label: "Operations & Procurement", value: "operations" },
          ],
        },
        {
          name: "heroImage",
          type: "upload",
          relationTo: "media",
          label: "Gambar hero",
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "outcome",
      type: "textarea",
      label: "Business outcome",
      admin: {
        description: "Jelaskan hasil bisnis yang ingin dicapai melalui solusi ini.",
      },
    },
    {
      name: "features",
      type: "array",
      label: "Fitur utama",
      minRows: 1,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "iconKey",
      type: "select",
      label: "Ikon",
      required: true,
      options: [
        { label: "Infrastructure", value: "infrastructure" },
        { label: "Network", value: "network" },
        { label: "Security", value: "security" },
        { label: "Cloud", value: "cloud" },
        { label: "Managed service", value: "managed-service" },
        { label: "Procurement", value: "procurement" },
      ],
    },
    {
      name: "benefits",
      type: "array",
      label: "Manfaat bisnis",
      maxRows: 6,
      fields: [
        { name: "title", type: "text", required: true, label: "Judul" },
        { name: "description", type: "textarea", required: true, label: "Penjelasan" },
      ],
    },
    {
      name: "useCases",
      type: "array",
      label: "Use case",
      maxRows: 8,
      fields: [
        { name: "label", type: "text", required: true, label: "Nama use case" },
      ],
    },
    {
      name: "content",
      type: "richText",
      label: "Konten detail",
      admin: {
        description: "Opsional untuk penjelasan teknis atau informasi tambahan di halaman detail.",
      },
    },
    {
      name: "relatedPartners",
      type: "relationship",
      relationTo: "partners",
      hasMany: true,
      label: "Partner terkait",
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      required: true,
      index: true,
      label: "Urutan",
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: false,
      required: true,
      label: "Tayang di website",
    },
  ],
};
