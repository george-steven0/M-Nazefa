import { Navigate, Outlet, useMatches } from "react-router-dom";
import {
  ROLE_PERMISSIONS,
  type AppRole,
  type Permission,
} from "../../../Utilities/permissions.config";

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

  const user = {
    role: "super_admin",
  };
  const role = user.role as AppRole;

  const matchWithHandle = matches.find(
    (m) => m.handle && (m.handle as routeHandle).permission,
  );
  const requiredPermission = (matchWithHandle?.handle as routeHandle)
    ?.permission;
  // console.log(requiredPermission);

  const allowedPermissions = ROLE_PERMISSIONS[role] || [];
  const hasPermission = allowedPermissions.includes(requiredPermission);
  // console.log(hasPermission);

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
}
