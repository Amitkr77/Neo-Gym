import jwt from "jsonwebtoken";

// Roles carried in the JWT. Members log in via /api/auth, admins via /api/admin.
export const ROLES = Object.freeze({ ADMIN: "admin", MEMBER: "member" });

export const signToken = (id, role) =>
  jwt.sign({ sub: String(id), role }, process.env.JWT_SECRET, {
    expiresIn:
      role === ROLES.ADMIN
        ? process.env.ADMIN_JWT_EXPIRY || "8h"
        : process.env.JWT_EXPIRY || "1h",
  });

const readToken = (req) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  return scheme === "Bearer" && token ? token : null;
};

export const requireAuth = (req, res, next) => {
  const token = readToken(req);
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ message: "Session expired or invalid. Please log in again." });
  }
};

export const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.auth?.role)
    ? next()
    : res.status(403).json({ message: "You do not have permission to perform this action" });

export const requireAdmin = [requireAuth, requireRole(ROLES.ADMIN)];
export const requireMember = [requireAuth, requireRole(ROLES.MEMBER)];
