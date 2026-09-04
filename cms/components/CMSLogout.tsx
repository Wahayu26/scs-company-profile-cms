import type { AdminViewServerProps } from "payload";
import CMSLogoutClient from "./CMSLogoutClient";

export default function CMSLogout({ initPageResult }: AdminViewServerProps) {
  const { routes, admin } = initPageResult.req.payload.config;
  return <CMSLogoutClient apiURL={`${routes.api}/${admin.user}`} loginURL={`${routes.admin}${admin.routes.login}`} />;
}
