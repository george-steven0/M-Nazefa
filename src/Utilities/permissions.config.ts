// permissions.config.ts

// 1) Define all permissions in one place
export const PERMISSIONS = {
  PROFILE: "profile",
  // employees
  ADD_EMPLOYEE: "add_employee",
  EDIT_EMPLOYEE: "edit_employee",
  VIEW_EMPLOYEE: "view_employee",
  //   DELETE_EMPLOYEE: "delete_employee",

  // Clients
  ADD_CLIENT: "add_client",
  EDIT_CLIENT: "edit_client",
  VIEW_CLIENT: "view_client",
  DELETE_CLIENT: "delete_client",

  // Reservations
  ADD_RESERVATION: "add_reservation",
  EDIT_RESERVATION: "edit_reservation",
  DELETE_RESERVATION: "delete_reservation",
  VIEW_RESERVATION: "view_reservation",

  // Services
  ADD_SERVICE: "add_service",
  EDIT_SERVICE: "edit_service",
  VIEW_SERVICE: "view_service",

  // Packages
  ADD_PACKAGE: "add_package",
  EDIT_PACKAGE: "edit_package",
  VIEW_PACKAGE: "view_package",

  // Dashboard
  VIEW_DASHBOARD: "view_dashboard",
  //   VIEW_DASHBOARD_ANALYTICS: "view_dashboard_analytics",

  VIEW_ROLES: "view_roles",
  VIEW_AREAS: "view_areas",
  VIEW_WORKERS: "view_workers",

  //Membership
  // ADD_MEMBERSHIP: "add_membership",
  // EDIT_MEMBERSHIP: "edit_membership",
  VIEW_MEMBERSHIP: "view_membership",
  // DELETE_MEMBERSHIP: "delete_membership",
} as const;

// 2) Permission type
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// 3) Roles
export const ROLES = {
  CUSTOMER_SERVICE: "customer_service",
  DATA_ENTRY: "data_entry",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

// 4) Role → Permission mapping
export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  customer_service: [
    PERMISSIONS.PROFILE,
    PERMISSIONS.ADD_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.VIEW_CLIENT,

    PERMISSIONS.ADD_RESERVATION,
    PERMISSIONS.VIEW_RESERVATION,

    PERMISSIONS.VIEW_SERVICE,
    PERMISSIONS.VIEW_PACKAGE,

    PERMISSIONS.VIEW_DASHBOARD,
  ],

  data_entry: [
    PERMISSIONS.PROFILE,
    PERMISSIONS.ADD_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.VIEW_CLIENT,
    // PERMISSIONS.VIEW_DASHBOARD,
  ],

  admin: [
    PERMISSIONS.PROFILE,
    // Services
    PERMISSIONS.ADD_SERVICE,
    PERMISSIONS.EDIT_SERVICE,
    PERMISSIONS.VIEW_SERVICE,

    // Packages
    PERMISSIONS.ADD_PACKAGE,
    PERMISSIONS.EDIT_PACKAGE,
    PERMISSIONS.VIEW_PACKAGE,

    //EMPLOYEES

    PERMISSIONS.ADD_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.VIEW_EMPLOYEE,

    // Clients
    PERMISSIONS.ADD_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.VIEW_CLIENT,
    PERMISSIONS.DELETE_CLIENT,

    // Reservations
    PERMISSIONS.EDIT_RESERVATION,
    PERMISSIONS.DELETE_RESERVATION,
  ],

  super_admin: [
    // Super admin gets everything admin has
    ...[], // we'll inherit below
  ],
};

// 5) Inherit admin permissions for super admin
ROLE_PERMISSIONS.super_admin = [
  ...ROLE_PERMISSIONS.admin,
  PERMISSIONS.VIEW_DASHBOARD,
  PERMISSIONS.VIEW_ROLES,
  PERMISSIONS.VIEW_AREAS,
  PERMISSIONS.VIEW_WORKERS,
  PERMISSIONS.VIEW_RESERVATION,
  PERMISSIONS.VIEW_MEMBERSHIP,
];
