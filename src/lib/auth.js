import crypto from "crypto";

const SECRET_KEY = process.env.ADMIN_SESSION_SECRET || "mex_tanim_super_secure_session_salt_2026";

/**
 * Hash a plain password using Node.js crypto scrypt
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a plain password against stored salt:hash
 */
export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, key] = storedHash.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

/**
 * Generate a cryptographically signed session token
 */
export function createSessionToken(username = "admin") {
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}`;
  const hmac = crypto.createHmac("sha256", SECRET_KEY).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64");
}

/**
 * Verify signed session token (valid for 7 days)
 */
export function verifySessionToken(token) {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [username, timestampStr, hmac] = parts;
    const timestamp = parseInt(timestampStr, 10);

    // Expire after 7 days
    if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) return false;

    const expectedHmac = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(`${username}:${timestamp}`)
      .digest("hex");

    return crypto.timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(expectedHmac, "hex"));
  } catch {
    return false;
  }
}
