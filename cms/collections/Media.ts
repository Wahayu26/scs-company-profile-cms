import path from "node:path";
import { fileURLToPath } from "node:url";

import type { CollectionConfig } from "payload";

import { authenticated } from "../access";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Media",
    plural: "Media",
  },
  admin: {
    group: "Pustaka",
    useAsTitle: "alt",
    description: "Pusat gambar untuk proyek, insight, dan logo partner.",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  upload: {
    staticDir: path.resolve(dirname, "../../public/media"),
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 480, height: 320, position: "centre" },
      { name: "card", width: 960, height: 640, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      label: "Teks alternatif",
    },
    {
      name: "caption",
      type: "text",
      label: "Keterangan",
    },
  ],
};
