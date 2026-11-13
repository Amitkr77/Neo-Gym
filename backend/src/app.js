import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import staffRouter from "./routes/staffRoutes.js";
import MembersRouter from "./routes/MembersRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// Builds the Express app without connecting to the database or listening,
// so it can be imported by tests.
export const createApp = () => {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", process.env.TRUST_PROXY === "true");

  // CORS: restrict to CORS_ORIGINS (comma-separated) when configured. Authentication uses
  // bearer tokens rather than cookies, so cross-site request forgery does not apply.
  const origins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  app.use(cors(origins.length ? { origin: origins } : undefined));

  // Basic security headers (dependency-free subset of what helmet provides).
  app.use((_req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
      "Cross-Origin-Resource-Policy": "same-site",
    });
    next();
  });

  app.use(express.json({ limit: "100kb" }));

  app.get("/", (_req, res) => res.send("Server is running"));
  app.get("/api/health", (_req, res) =>
    res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" })
  );

  app.use("/api/auth", authRoutes);
  app.use("/api/member", MembersRouter);
  app.use("/api/staff", staffRouter);
  app.use("/api/announcement", announcementRoutes);
  app.use("/api/equipment", equipmentRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/task", taskRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api", contactRoutes);

  app.use("/api", (_req, res) => res.status(404).json({ message: "Not found" }));

  // Global error handler: malformed JSON → 400; everything else → generic 500.
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err?.type === "entity.parse.failed") {
      return res.status(400).json({ message: "Malformed JSON body" });
    }
    if (err?.type === "entity.too.large") {
      return res.status(413).json({ message: "Request body too large" });
    }
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  });

  return app;
};

export default createApp;
