import { Navigate } from "react-router-dom";
import { getFirstAllowedPath } from "../../../Utilities/utilities";

// "/" goes to the first page the user's role can open (admin has no dashboard)
export default function HomeRedirect() {
  return <Navigate to={getFirstAllowedPath()} replace />;
}
