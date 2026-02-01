// GuestRule.jsx (Unprotected/Guest Route Guard)
import { Navigate, Outlet } from "react-router-dom";

export default function GuestRule() {
  const tk = localStorage.getItem("mNazTk");

  if (tk) {
    // If token EXISTS, they shouldn't be here, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If NO token, allow access to the child route (Outlet - which is Login)
  return <Outlet />;
}
