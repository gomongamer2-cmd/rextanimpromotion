import crypto from "crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Generate a random Base32 secret for Google Authenticator (TOTP)
 */
export function generateBase32Secret(length = 20) {
  const bytes = crypto.randomBytes(length);
  let secret = "";
  for (let i = 0; i < bytes.length; i++) {
    secret += BASE32_ALPHABET[bytes[i] % 32];
  }
  return secret;
}

/**
 * Decode Base32 string to Buffer
 */
function base32Decode(base32) {
  const cleaned = base32.toUpperCase().replace(/=+$/, "");
  let bits = 0;
  let value = 0;
  const output = [];

  for (let i = 0; i < cleaned.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(output);
}

/**
 * Verify a 6-digit TOTP code against a Base32 secret (window = 1 allows 30-sec drift)
 */
export function verifyTOTP(token, secret, window = 1) {
  if (!token || !secret) return false;
  const cleanedToken = token.trim().replace(/\s+/g, "");
  if (cleanedToken.length !== 6) return false;

  const currentCounter = Math.floor(Date.now() / 1000 / 30);
  const key = base32Decode(secret);

  for (let i = -window; i <= window; i++) {
    const counter = currentCounter + i;
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(counter));

    const hmac = crypto.createHmac("sha1", key).update(buffer).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff);

    const generatedCode = (code % 1000000).toString().padStart(6, "0");
    if (generatedCode === cleanedToken) {
      return true;
    }
  }

  return false;
}
