import { ensureFirstAdmin } from '../first-admin';
/* scs-auth-repair-v1 */
import type { CollectionConfig } from "payload";

import { adminOrSelf, canAccessCMS, canSetRole, isCMSAdmin } from "../user-access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Pengguna",
    plural: "Pengguna",
  },
  auth: true,
  hooks: { beforeChange: [ensureFirstAdmin] },
  admin: {
    group: "Administrasi",
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
  },
  access: {
    admin: canAccessCMS,
    create: isCMSAdmin,
    delete: isCMSAdmin,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nama lengkap",
    },
    {
      name: "role",
      access: { create: canSetRole, update: canSetRole },
      type: "select",
      defaultValue: "editor",
      required: true,
      label: "Peran",
      options: [
        { label: "Administrator", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
    },
  ],
};
