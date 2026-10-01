import { randomBytes, createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Per-process fallback secret used when CSRF_SECRET is not provided. It is
 * generated at random on startup so tokens created and validated within the
 * same process stay consistent, without ever hardcoding a secret value.
 */
const ephemeralSecret = randomBytes(32).toString("hex");

/**
 * Resolves the secret used to sign and verify CSRF tokens.
 * Uses the CSRF_SECRET environment variable when set, falling back to a
 * per-process random secret otherwise.
 * @returns {string} The CSRF signing secret
 */
function getCSRFSecret(): string {
  return process.env.CSRF_SECRET ?? ephemeralSecret;
}

/**
 * Generates a CSRF token with timestamp
 * @returns {string} Base64 encoded CSRF token
 */
export function generateCSRFToken(): string {
  const timestamp = Date.now().toString();
  const randomValue = randomBytes(32).toString("hex");
  const payload = `${timestamp}:${randomValue}`;

  const signature = createHmac("sha256", getCSRFSecret())
    .update(payload)
    .digest("hex");

  const token = `${payload}:${signature}`;
  return Buffer.from(token).toString("base64");
}

interface DecodedCSRFToken {
  timestamp: string;
  payload: string;
  signature: string;
}

/**
 * Decodes a base64 CSRF token into its parts.
 * Returns null if the token does not have the expected structure.
 */
function decodeCSRFToken(token: string): DecodedCSRFToken | null {
  const decoded = Buffer.from(token, "base64").toString("utf-8");
  const parts = decoded.split(":");

  if (parts.length !== 3) {
    return null;
  }

  const [timestamp, randomValue, signature] = parts;
  return { timestamp, payload: `${timestamp}:${randomValue}`, signature };
}

/**
 * Verifies the HMAC signature of a token payload using constant-time comparison.
 */
function hasValidSignature(payload: string, signature: string): boolean {
  const expectedSignature = createHmac("sha256", getCSRFSecret())
    .update(payload)
    .digest("hex");

  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  return (
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(signatureBuffer, expectedBuffer)
  );
}

/**
 * Checks whether the token timestamp is older than the allowed expiry window.
 */
function isExpired(timestamp: string): boolean {
  const tokenTime = Number.parseInt(timestamp, 10);
  return Date.now() - tokenTime > TOKEN_EXPIRY;
}

/**
 * Validates a CSRF token
 * @param {string} token - Base64 encoded CSRF token
 * @returns {boolean} True if token is valid and not expired
 */
export function validateCSRFToken(token: string): boolean {
  try {
    const decoded = decodeCSRFToken(token);

    if (!decoded) {
      return false;
    }

    return (
      hasValidSignature(decoded.payload, decoded.signature) &&
      !isExpired(decoded.timestamp)
    );
  } catch {
    return false;
  }
}
