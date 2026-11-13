import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import FRONTEND_URL from "../../constant/const";
import { getToken, clearSession, saveSession } from "../../lib/session";

// Blocks every /admin page until the stored token has been confirmed by the API.
export default function RequireAdmin({ children }) {
  const location = useLocation();
  const [state, setState] = useState(getToken() ? "checking" : "denied");

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    axios
      .get(`${FRONTEND_URL}/api/admin/me`)
      .then((res) => {
        if (cancelled) return;
        saveSession(getToken(), res.data.admin);
        setState("ok");
      })
      .catch(() => {
        if (cancelled) return;
        clearSession();
        setState("denied");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "denied") return <Navigate to="/" replace state={{ from: location.pathname }} />;
  if (state === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600" role="status">
        Checking your session…
      </div>
    );
  }
  return children;
}
