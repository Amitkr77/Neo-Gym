import dotenv from "dotenv";
import db from "./src/database/database.js";
import { createApp } from "./src/app.js";

dotenv.config({ path: "./.env" });

// Fail fast on missing configuration instead of failing at the first login.
const REQUIRED_ENV = ["PORT", "CONNECTION_STRING", "JWT_SECRET"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")} (see .env.example)`);
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 32) {
  console.warn("Warning: JWT_SECRET is shorter than 32 characters. Use a long random value in production.");
}
if (!process.env.CORS_ORIGINS) {
  console.warn("Warning: CORS_ORIGINS is not set; the API accepts requests from any origin.");
}

const start = async () => {
  await db(); // exits the process on failure
  const app = createApp();
  const PORT = Number(process.env.PORT);
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

start();
