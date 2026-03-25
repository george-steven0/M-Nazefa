import { Navigate, Outlet, useMatches } from "react-router-dom";
import {
  ROLE_PERMISSIONS,
  type Permission,
} from "../../../Utilities/permissions.config";
import { userRoles } from "../../../Utilities/utilities";

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

  // const user = JSON.parse(localStorage.getItem("mNazRole") || "[]") as {
  //   roleName: AppRole;
  // }[];
  // const role = user.map(
  //   (u) =>
  //     u.roleName
  //       .replace(/([a-z])([A-Z])/g, "$1 $2")
  //       .replace(/[\s-]+/g, "_")
  //       .toLowerCase() as AppRole,
  // );

  // console.log(role);

  // const matchWithHandle = matches.find(
  //   (m) => m.handle && (m.handle as routeHandle).permission,
  // );

  const currentMatch = matches[matches.length - 1];
  const requiredPermission = (currentMatch?.handle as routeHandle)?.permission;

  // console.log(currentMatch);

  if (!requiredPermission) {
    return children ? children : <Outlet />;
  }
  // console.log(requiredPermission);

  const allowedPermissions = userRoles.flatMap(
    (r) => ROLE_PERMISSIONS[r] || [],
  );

  // console.log(allowedPermissions);

  const hasPermission = allowedPermissions.includes(requiredPermission);
  // console.log(hasPermission);

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
}
