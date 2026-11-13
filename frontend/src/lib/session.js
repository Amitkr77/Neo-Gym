import axios from "axios";
import FRONTEND_URL from "../constant/const";

const TOKEN_KEY = "memberToken";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const saveSession = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  // Keys written by older versions of the app (identity used to be read from userId).
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
};

// Attach the member token to API requests; end the session if the API rejects it.
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
      if (error.response?.status === 401 && error.config?.headers?.Authorization) {
        clearSession();
        window.location.assign("/login?expired=1");
      }
      return Promise.reject(error);
    }
  );
};
