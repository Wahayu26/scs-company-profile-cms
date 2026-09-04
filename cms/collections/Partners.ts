import type { CollectionConfig } from "payload";

import { authenticated, authenticatedOrPublished } from "../access";

export const Partners: CollectionConfig = {
  slug: "partners",
  labels: {
    singular: "Partner",
    plural: "Partner",
  },
  admin: {
    group: "Konten Website",
    useAsTitle: "name",
    defaultColumns: ["order", "name", "published", "updatedAt"],
    description: "Kelola logo partner teknologi yang tampil pada ekosistem SCS.",
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
      name: "name",
      type: "text",
      required: true,
      label: "Nama partner",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Logo",
    },
    {
      name: "website",
      type: "text",
      label: "Website",
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
