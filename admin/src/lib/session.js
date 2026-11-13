import axios from "axios";
import FRONTEND_URL from "../constant/const";

const TOKEN_KEY = "adminToken";
const ADMIN_KEY = "adminProfile";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getAdminProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_KEY)) || null;
  } catch {
    return null;
  }
};

export const saveSession = (token, admin) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin || {}));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
  // Keys used by older versions of the app.
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

// Attach the admin token to every request sent to our API, and end the session when the
// API reports it as expired or invalid.
let installed = false;
export const installAuthInterceptors = () => {
  if (installed) return;
  installed = true;

  axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token && (config.url || "").startsWith(FRONTEND_URL)) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const sentToken = error.config?.headers?.Authorization;
      if (error.response?.status === 401 && sentToken) {
        clearSession();
        if (window.location.pathname !== "/") window.location.assign("/?expired=1");
      }
      return Promise.reject(error);
    }
  );
};

// Generates a key that makes a single form submission idempotent on the server.
export const newIdempotencyKey = () =>
  (window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`);
