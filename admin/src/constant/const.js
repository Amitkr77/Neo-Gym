// Backend API base URL. Configure with VITE_API_URL (see .env.example); defaults to local dev.
// (Historically named FRONTEND_URL; it has always pointed at the backend.)
const FRONTEND_URL = (import.meta.env.VITE_API_URL || "http://localhost:7002").replace(/\/$/, "");

export const API_URL = FRONTEND_URL;
export const GYM_NAME = import.meta.env.VITE_GYM_NAME || "NeoGym";
export const CURRENCY = import.meta.env.VITE_CURRENCY_SYMBOL || "₹";

export default FRONTEND_URL;
