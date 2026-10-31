import { Navigate, Outlet, useMatches } from "react-router-dom";
import {
  ROLE_PERMISSIONS,
  type Permission,
} from "../../../Utilities/permissions.config";
import { getUserRoles } from "../../../Utilities/utilities";
import { logout } from "../../../Utilities/auth";

interface guardProps {
  children?: React.ReactNode;
}

type routeHandle = {
  permission: Permission;
};

export default function GuardRole({ children }: guardProps) {
  const tk = localStorage.getItem("mNazTk");
  const roles = localStorage.getItem("mNazRole");
  const matches = useMatches();

  if (!tk || !roles) {
    logout();
    return <Navigate to="/login" replace />;
  }

  // Check every matched route, not only the deepest one, so a child route
  // without its own permission still requires its parent's permission.
  const requiredPermissions = matches
    .map((match) => (match.handle as routeHandle | undefined)?.permission)
    .filter((permission): permission is Permission => Boolean(permission));

  const allowedPermissions = getUserRoles().flatMap(
    (r) => ROLE_PERMISSIONS[r] || [],
  );

  const hasPermission = requiredPermissions.every((permission) =>
    allowedPermissions.includes(permission),
  );

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
}
