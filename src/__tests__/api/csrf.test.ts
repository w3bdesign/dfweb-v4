/**
 * @jest-environment node
 */
import { createHmac } from "node:crypto";
import { generateCSRFToken, validateCSRFToken } from "@/lib/csrf";

const TEST_SECRET = "test-csrf-secret";
const ONE_HOUR = 60 * 60 * 1000;

const decode = (token: string) =>
  Buffer.from(token, "base64").toString("utf-8").split(":");

const encode = (value: string) => Buffer.from(value).toString("base64");

describe("lib/csrf", () => {
  const originalSecret = process.env.CSRF_SECRET;

  beforeEach(() => {
    process.env.CSRF_SECRET = TEST_SECRET;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalSecret === undefined) {
      delete process.env.CSRF_SECRET;
    } else {
      process.env.CSRF_SECRET = originalSecret;
    }
  });

  it("generates a base64 token with timestamp, random value and HMAC signature", () => {
    // Arrange
    const now = 1_700_000_000_000;
    jest.spyOn(Date, "now").mockReturnValue(now);

    // Act
    const [timestamp, randomValue, signature] = decode(generateCSRFToken());

    // Assert
    const expected = createHmac("sha256", TEST_SECRET)
      .update(`${timestamp}:${randomValue}`)
      .digest("hex");
    expect(timestamp).toBe(String(now));
    expect(randomValue).toMatch(/^[0-9a-f]{64}$/);
    expect(signature).toBe(expected);
  });

  it("generates a unique token on every call", () => {
    // Arrange
    const first = generateCSRFToken();

    // Act
    const second = generateCSRFToken();

    // Assert
    expect(second).not.toBe(first);
  });

  it("accepts a freshly generated token", () => {
    // Arrange
    const token = generateCSRFToken();

    // Act
    const result = validateCSRFToken(token);

    // Assert
    expect(result).toBe(true);
  });

  it("accepts a token exactly at the one hour boundary", () => {
    // Arrange
    const issuedAt = 1_700_000_000_000;
    const nowSpy = jest.spyOn(Date, "now").mockReturnValue(issuedAt);
    const token = generateCSRFToken();
    nowSpy.mockReturnValue(issuedAt + ONE_HOUR);

    // Act
    const result = validateCSRFToken(token);

    // Assert
    expect(result).toBe(true);
  });

  it("rejects an expired token", () => {
    // Arrange
    const issuedAt = 1_700_000_000_000;
    const nowSpy = jest.spyOn(Date, "now").mockReturnValue(issuedAt);
    const token = generateCSRFToken();
    nowSpy.mockReturnValue(issuedAt + ONE_HOUR + 1);

    // Act
    const result = validateCSRFToken(token);

    // Assert
    expect(result).toBe(false);
  });

  it("rejects a token with a tampered signature", () => {
    // Arrange
    const [timestamp, randomValue, signature] = decode(generateCSRFToken());
    const flipped = (signature[0] === "a" ? "b" : "a") + signature.slice(1);
    const tampered = encode(`${timestamp}:${randomValue}:${flipped}`);

    // Act
    const result = validateCSRFToken(tampered);

    // Assert
    expect(result).toBe(false);
  });

  it("rejects a token with a tampered timestamp", () => {
    // Arrange
    const [timestamp, randomValue, signature] = decode(generateCSRFToken());
    const tampered = encode(
      `${Number(timestamp) + 1000}:${randomValue}:${signature}`,
    );

    // Act
    const result = validateCSRFToken(tampered);

    // Assert
    expect(result).toBe(false);
  });

  it("rejects a token signed with a different secret", () => {
    // Arrange
    const token = generateCSRFToken();
    process.env.CSRF_SECRET = "another-secret";

    // Act
    const result = validateCSRFToken(token);

    // Assert
    expect(result).toBe(false);
  });

  const malformedTokens: Array<{ label: string; token: string }> = [
    { label: "an empty string", token: "" },
    { label: "random text", token: "not-a-token" },
    { label: "too few parts", token: encode("123:abc") },
    { label: "too many parts", token: encode("1:2:3:4") },
    { label: "a non-hex signature", token: encode("1700000000000:abc:zz") },
  ];

  malformedTokens.forEach(({ label, token }) => {
    it(`rejects a malformed token (${label})`, () => {
      // Arrange
      const input = token;

      // Act
      const result = validateCSRFToken(input);

      // Assert
      expect(result).toBe(false);
    });
  });

  it("returns false instead of throwing for a non-string token", () => {
    // Arrange
    const input = 42 as unknown as string;

    // Act
    const result = validateCSRFToken(input);

    // Assert
    expect(result).toBe(false);
  });

  it("falls back to a per-process secret and warns once when CSRF_SECRET is missing", async () => {
    // Arrange
    delete process.env.CSRF_SECRET;
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.resetModules();
    const csrf = await import("@/lib/csrf");

    // Act
    const token = csrf.generateCSRFToken();
    const result = csrf.validateCSRFToken(token);

    // Assert
    expect(result).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
