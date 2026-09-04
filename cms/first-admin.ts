import type { CollectionBeforeChangeHook } from "payload";

// Payload's first-user endpoint already rejects onboarding when any user exists.
// Ensure a new installation cannot bootstrap an editor with no way to manage users.
export const ensureFirstAdmin: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation === "create" && !req.user) {
    const count = await req.payload.count({ collection: "users", req, overrideAccess: true });
    if (count.totalDocs === 0) return { ...data, role: "admin" };
  }
  return data;
};
