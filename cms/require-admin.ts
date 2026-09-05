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

export function requireCMSAdmin(initPageResult: AdminViewServerProps["initPageResult"]) {
  const user = requireCMSUser(initPageResult);
  const { routes, admin } = initPageResult.req.payload.config;
  if (!("role" in user) || user.role !== "admin") {
    redirect(`${routes.admin}${admin.routes.unauthorized}`);
  }
  return user;
}
