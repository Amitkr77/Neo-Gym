// Backend API base URL. Configure with VITE_API_URL (see .env.example); defaults to local dev.
// (Historically named FRONTEND_URL; it has always pointed at the backend.)
const FRONTEND_URL = (import.meta.env.VITE_API_URL || "http://localhost:7002").replace(/\/$/, "");

export default FRONTEND_URL;
