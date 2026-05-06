import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  type AppRole,
  type Permission,
} from "./permissions.config";

const parseRoles = (): AppRole[] => {
  const user = JSON.parse(localStorage.getItem("mNazRole") || "[]") as {
    roleName: AppRole;
  }[];
  return user.map(
    (u) =>
      u.roleName
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[\s-]+/g, "_")
        .toLowerCase() as AppRole,
  );
};

export const getUserRoles = (): AppRole[] => parseRoles();

export const isCustomerService = () =>
  parseRoles().includes("customer_service");
export const isDataEntry = () => parseRoles().includes("data_entry");
export const isAdmin = () => parseRoles().includes("admin");
export const isSuperAdmin = () => parseRoles().includes("super_admin");

const NAV_ROUTES = [
  { path: "/dashboard", permission: PERMISSIONS.VIEW_DASHBOARD },
  { path: "/profile", permission: PERMISSIONS.PROFILE },
  { path: "/employees", permission: PERMISSIONS.VIEW_EMPLOYEE },
  { path: "/roles", permission: PERMISSIONS.VIEW_ROLES },
  { path: "/areas", permission: PERMISSIONS.VIEW_AREAS },
  { path: "/memberships", permission: PERMISSIONS.VIEW_MEMBERSHIP },
  { path: "/clients", permission: PERMISSIONS.VIEW_CLIENT },
  { path: "/workers", permission: PERMISSIONS.VIEW_WORKERS },
  { path: "/services", permission: PERMISSIONS.VIEW_SERVICE },
  { path: "/packages", permission: PERMISSIONS.VIEW_PACKAGE },
  { path: "/package_types", permission: PERMISSIONS.VIEW_PACKAGE_TYPE },
  { path: "/cleaning_area", permission: PERMISSIONS.VIEW_CLEANING_AREA },
  { path: "/reservations", permission: PERMISSIONS.VIEW_RESERVATION },
  { path: "/complaints", permission: PERMISSIONS.VIEW_COMPLAINTS },
  { path: "/messages", permission: PERMISSIONS.VIEW_MESSAGES },
];

export const getFirstAllowedPath = (): string => {
  const allowedPermissions = getUserRoles().flatMap(
    (r) => ROLE_PERMISSIONS[r] || [],
  );
  const first = NAV_ROUTES.find((route) =>
    allowedPermissions.includes(route.permission as Permission),
  );
  return first?.path ?? "/login";
};
