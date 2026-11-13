import bcrypt from "bcryptjs";
import crypto from "crypto";

const BCRYPT_HASH = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

export const isBcryptHash = (value) => typeof value === "string" && BCRYPT_HASH.test(value);

export const hashPassword = (plain) => bcrypt.hash(plain, 10);

// Verifies a password against a stored value. Older records (admins, and members created
// from the admin panel) were saved in plaintext; those still verify once and are flagged
// `legacy` so the caller can re-hash them. This avoids locking existing users out.
export const verifyPassword = async (plain, stored) => {
  if (typeof plain !== "string" || typeof stored !== "string" || !stored) {
    return { ok: false, legacy: false };
  }
  if (isBcryptHash(stored)) {
    return { ok: await bcrypt.compare(plain, stored), legacy: false };
  }
  const a = Buffer.from(plain);
  const b = Buffer.from(stored);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  return { ok, legacy: ok };
};
