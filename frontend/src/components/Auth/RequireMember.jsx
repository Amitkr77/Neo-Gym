import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../../lib/session";

// Member-only pages. The API also enforces this; the guard just avoids showing an empty
// portal to logged-out visitors.
export default function RequireMember({ children }) {
  const location = useLocation();
  if (!getToken()) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
