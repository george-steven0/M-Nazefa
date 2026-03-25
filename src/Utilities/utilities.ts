import type { AppRole } from "./permissions.config";

const user = JSON.parse(localStorage.getItem("mNazRole") || "[]") as {
  roleName: AppRole;
}[];
export const userRoles = user.map(
  (u) =>
    u.roleName
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[\s-]+/g, "_")
      .toLowerCase() as AppRole,
);
