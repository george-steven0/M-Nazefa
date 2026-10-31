// GuestRule.jsx (Unprotected/Guest Route Guard)
import { Navigate, Outlet } from "react-router-dom";
import { getFirstAllowedPath } from "../../../Utilities/utilities";

export default function GuestRule() {
  const tk = localStorage.getItem("mNazTk");

  if (tk) {
    // If token EXISTS, they shouldn't be here, redirect to the first page
    // their role can open (not every role can see the dashboard)
    const path = getFirstAllowedPath();
    // No allowed page (e.g. no roles) would redirect to /login again - stay put
    if (path !== "/login") return <Navigate to={path} replace />;
  }

  // If NO token, allow access to the child route (Outlet - which is Login)
  return <Outlet />;
}
