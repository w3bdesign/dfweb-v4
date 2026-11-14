/**
 * @vitest-environment node
 */
import type { Mock } from "vitest";
import { randomBytes } from "node:crypto";
import { GET } from "@/app/api/csrf-token/route";
import { generateCSRFToken, validateCSRFToken } from "@/lib/csrf";

// Wrap the real implementation so a single test can force a failure
vi.mock("@/lib/csrf", () => {
  const actual = jest.requireActual("@/lib/csrf");
  return {
    ...actual,
    generateCSRFToken: vi.fn(actual.generateCSRFToken),
  };
});

const mockGenerateCSRFToken = generateCSRFToken as Mock;

describe("GET /api/csrf-token", () => {
  const originalSecret = process.env.CSRF_SECRET;

  beforeEach(() => {
    process.env.CSRF_SECRET = randomBytes(16).toString("hex");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalSecret === undefined) {
      delete process.env.CSRF_SECRET;
    } else {
      process.env.CSRF_SECRET = originalSecret;
    }
  });

  it("returns 200 with a token that validates", async () => {
    // Arrange
    const handler = GET;

    // Act
    const response = await handler();
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(typeof body.csrfToken).toBe("string");
    expect(validateCSRFToken(body.csrfToken)).toBe(true);
  });

  it("sends no-store cache headers", async () => {
    // Arrange
    const expectedCacheControl =
      "no-store, no-cache, must-revalidate, proxy-revalidate";

    // Act
    const response = await GET();

    // Assert
    expect(response.headers.get("Cache-Control")).toBe(expectedCacheControl);
    expect(response.headers.get("Pragma")).toBe("no-cache");
    expect(response.headers.get("Expires")).toBe("0");
  });

  it("returns 500 when token generation throws", async () => {
    // Arrange
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockGenerateCSRFToken.mockImplementationOnce(() => {
      throw new Error("boom");
    });

    // Act
    const response = await GET();

    // Assert
    expect(response.status).toBe(500);
    expect(await response.json()).toStrictEqual({
      error: "Failed to generate CSRF token",
    });
  });
});
