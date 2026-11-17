import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = crypto
  .createHash("sha256")
  .update(process.env.CHAT_ENCRYPTION_SECRET || "mex_tanim_ultra_secure_chat_secret_2026")
  .digest();

/**
 * Encrypts plaintext string using AES-256-GCM
 */
export function encryptMessage(text) {
  try {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    let encrypted = cipher.update(String(text), "utf8", "hex");
    encrypted += cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");

    return `${iv.toString("hex")}:${tag}:${encrypted}`;
  } catch (err) {
    console.error("Encryption error:", err);
    return text;
  }
}

/**
 * Decrypts encrypted string formatted as iv:tag:ciphertext
 */
export function decryptMessage(encryptedString) {
  try {
    if (!encryptedString || typeof encryptedString !== "string" || !encryptedString.includes(":")) {
      return encryptedString;
    }

    const parts = encryptedString.split(":");
    if (parts.length !== 3) return encryptedString;

    const [ivHex, tagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("Decryption error:", err);
    return encryptedString;
  }
}
