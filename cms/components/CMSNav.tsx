import type { ServerProps } from "payload";
import CMSNavClient from "./CMSNavClient";

export default function CMSNav({ visibleEntities, permissions, user }: ServerProps) {
  const collections = (visibleEntities?.collections ?? []).filter(slug => permissions?.collections?.[slug]?.read);
  const globals = (visibleEntities?.globals ?? []).filter(slug => permissions?.globals?.[slug]?.read);
  return <CMSNavClient collections={collections} globals={globals} name={user?.name || "Pengguna"} role={user?.role || "editor"} />;
}
