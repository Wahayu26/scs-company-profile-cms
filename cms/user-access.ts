import type { Access, FieldAccess, PayloadRequest } from "payload";

export const isCMSAdmin: Access = ({ req }) => req.user?.collection === "users" && req.user.role === "admin";
export const canSetRole: FieldAccess = ({ req }) => req.user?.collection === "users" && req.user.role === "admin";
export const adminOrSelf: Access = ({ req }) => {
  if (!req.user || req.user.collection !== "users") return false;
  return req.user.role === "admin" ? true : { id: { equals: req.user.id } };
};
export const canAccessCMS = ({ req }: { req: PayloadRequest }): boolean => req.user?.collection === "users" && ["admin", "editor"].includes(req.user.role);
