const OBJECT_ID = /^[a-f0-9]{24}$/i;

export const isObjectId = (value) => typeof value === "string" && OBJECT_ID.test(value);

// Rejects malformed :id params with 400 instead of letting Mongoose throw a CastError (500).
export const validateObjectId = (param = "id") => (req, res, next) =>
  isObjectId(req.params[param])
    ? next()
    : res.status(400).json({ message: "Invalid id" });

// Copies only allow-listed keys from a request body (prevents mass assignment).
export const pick = (source, keys) =>
  Object.fromEntries(
    keys.filter((k) => source && source[k] !== undefined).map((k) => [k, source[k]])
  );

// Minimal fixed-window rate limiter (in-memory, per IP + route).
// Adequate for a single-instance deployment; use a shared store if the API is scaled out.
export const rateLimit = ({ windowMs, max, message }) => {
  const hits = new Map();
  return (req, res, next) => {
    const limit = typeof max === "function" ? max() : max;
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now - entry.start > windowMs) {
      hits.set(key, { start: now, count: 1 });
      return next();
    }
    entry.count += 1;
    if (entry.count > limit) {
      res.set("Retry-After", Math.ceil((entry.start + windowMs - now) / 1000));
      return res.status(429).json({ message: message || "Too many requests. Please try again later." });
    }
    return next();
  };
};
