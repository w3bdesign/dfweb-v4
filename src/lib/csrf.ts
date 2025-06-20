import { randomBytes, createHmac, timingSafeEqual } from "crypto";

const CSRF_SECRET =
  process.env.CSRF_SECRET || "default-csrf-secret-change-in-production";
const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Generates a CSRF token with timestamp
 * @returns {string} Base64 encoded CSRF token
 */
export function generateCSRFToken(): string {
  const timestamp = Date.now().toString();
  const randomValue = randomBytes(32).toString("hex");
  const payload = `${timestamp}:${randomValue}`;

  const signature = createHmac("sha256", CSRF_SECRET)
    .update(payload)
    .digest("hex");

  const token = `${payload}:${signature}`;
  return Buffer.from(token).toString("base64");
}

/**
 * Validates a CSRF token
 * @param {string} token - Base64 encoded CSRF token
 * @returns {boolean} True if token is valid and not expired
 */
export function validateCSRFToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");

    if (parts.length !== 3) {
      return false;
    }

    const [timestamp, randomValue, signature] = parts;
    const payload = `${timestamp}:${randomValue}`;

    // Verify signature
    const expectedSignature = createHmac("sha256", CSRF_SECRET)
      .update(payload)
      .digest("hex");

    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return false;
    }

    // Check if token is expired
    const tokenTime = parseInt(timestamp, 10);
    const currentTime = Date.now();

    if (currentTime - tokenTime > TOKEN_EXPIRY) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
