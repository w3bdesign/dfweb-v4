import { randomBytes, createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

let ephemeralSecret: string | undefined;

/**
 * Returns the HMAC secret used to sign CSRF tokens.
 * Uses CSRF_SECRET when set. Otherwise falls back to a random secret that
 * only lives for the current process, so no known secret ships in the source.
 * Tokens signed with the fallback do not validate across processes or
 * instances, so set CSRF_SECRET in every deployed environment.
 */
function getCSRFSecret(): string {
  const configuredSecret = process.env.CSRF_SECRET;
  if (configuredSecret) {
    return configuredSecret;
  }

  if (!ephemeralSecret) {
    console.warn(
      "CSRF_SECRET is not set. Using a random per-process secret; tokens will not validate across instances or restarts.",
    );
    ephemeralSecret = randomBytes(32).toString("hex");
  }

  return ephemeralSecret;
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
