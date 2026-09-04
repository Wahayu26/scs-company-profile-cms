import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";

/** Custom Payload views must enforce authentication before using the Local API. */
export function requireCMSUser({ req, permissions }: AdminViewServerProps["initPageResult"]) {
  const { routes, admin } = req.payload.config;
  if (!req.user) redirect(`${routes.admin}${admin.routes.login}`);
  if (req.user.collection !== admin.user || !permissions.canAccessAdmin) {
    redirect(`${routes.admin}${admin.routes.unauthorized}`);
  }
  return req.user;
}
