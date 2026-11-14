/**
 * @jest-environment node
 */
import { GET } from "@/app/api/csrf-token/route";
import { generateCSRFToken, validateCSRFToken } from "@/lib/csrf";

// Wrap the real implementation so a single test can force a failure
jest.mock("@/lib/csrf", () => {
  const actual = jest.requireActual("@/lib/csrf");
  return {
    ...actual,
    generateCSRFToken: jest.fn(actual.generateCSRFToken),
  };
});

const mockGenerateCSRFToken = generateCSRFToken as jest.Mock;

describe("GET /api/csrf-token", () => {
  const originalSecret = process.env.CSRF_SECRET;

  beforeEach(() => {
    process.env.CSRF_SECRET = "token-test-secret";
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    jest.spyOn(console, "error").mockImplementation(() => {});
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
