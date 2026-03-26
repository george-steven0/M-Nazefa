import { Navigate, Outlet, useMatches } from "react-router-dom";
import {
  ROLE_PERMISSIONS,
  type Permission,
} from "../../../Utilities/permissions.config";
import { getUserRoles } from "../../../Utilities/utilities";

interface guardProps {
  children?: React.ReactNode;
}

type routeHandle = {
  permission: Permission;
};

export default function GuardRole({ children }: guardProps) {
  const tk = localStorage.getItem("mNazTk");
  const matches = useMatches();

  if (!tk) return <Navigate to="/login" replace />;

  const currentMatch = matches[matches.length - 1];
  const requiredPermission = (currentMatch?.handle as routeHandle)?.permission;

  if (!requiredPermission) {
    return children ? children : <Outlet />;
  }

  const allowedPermissions = getUserRoles().flatMap(
    (r) => ROLE_PERMISSIONS[r] || [],
  );

  const hasPermission = allowedPermissions.includes(requiredPermission);

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
}
