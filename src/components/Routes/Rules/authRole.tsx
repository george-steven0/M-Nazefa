import { Navigate, Outlet } from "react-router-dom";

export default function AuthRule() {
  const tk = localStorage.getItem("mNazTk");
  //   console.log(tk);

  if (!tk) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
