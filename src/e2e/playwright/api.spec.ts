import { test, expect } from "@playwright/test";

/**
 * HTTP-level tests against the running Next.js server.
 * These complement the Jest route tests by exercising the real request
 * pipeline (routing, headers, body parsing and the CSP middleware).
 */

const VALID_FORM = {
  navn: "Ola Nordmann",
  telefon: "12345678",
  tekst: "Hei, dette er en testmelding.",
};

test.describe("GET /api/csrf-token", () => {
  test("returns a token with no-store cache headers", async ({ request }) => {
    const response = await request.get("/api/csrf-token");

    expect(response.status()).toBe(200);
    expect(response.headers()["cache-control"]).toContain("no-store");
    const body = await response.json();
    expect(typeof body.csrfToken).toBe("string");
    expect(body.csrfToken.length).toBeGreaterThan(0);
  });

  test("returns a different token on every call", async ({ request }) => {
    const first = await (await request.get("/api/csrf-token")).json();
    const second = await (await request.get("/api/csrf-token")).json();

    expect(second.csrfToken).not.toBe(first.csrfToken);
  });
});

test.describe("POST /api/form", () => {
  test("accepts valid JSON with a token from /api/csrf-token", async ({
    request,
  }) => {
    const { csrfToken } = await (await request.get("/api/csrf-token")).json();

    const response = await request.post("/api/form", {
      data: { ...VALID_FORM, csrfToken },
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({
      message: "Form submitted successfully",
      success: true,
    });
  });

  test("accepts valid urlencoded data with a _csrf field", async ({
    request,
  }) => {
    const { csrfToken } = await (await request.get("/api/csrf-token")).json();

    const response = await request.post("/api/form", {
      form: { ...VALID_FORM, _csrf: csrfToken },
    });

    expect(response.status()).toBe(200);
  });

  test("returns 400 for an unsupported content type", async ({ request }) => {
    const response = await request.post("/api/form", {
      headers: { "content-type": "text/plain" },
      data: "navn=Ola",
    });

    expect(response.status()).toBe(400);
  });

  test("returns 403 when the CSRF token is missing", async ({ request }) => {
    const response = await request.post("/api/form", { data: VALID_FORM });

    expect(response.status()).toBe(403);
    expect((await response.json()).error).toBe("CSRF token missing");
  });

  test("returns 403 for a forged CSRF token", async ({ request }) => {
    const forged = Buffer.from(`${Date.now()}:abc:${"0".repeat(64)}`).toString(
      "base64",
    );

    const response = await request.post("/api/form", {
      data: { ...VALID_FORM, csrfToken: forged },
    });

    expect(response.status()).toBe(403);
    expect((await response.json()).error).toBe("Invalid or expired CSRF token");
  });

  test("returns 400 with a validation message for invalid data", async ({
    request,
  }) => {
    const { csrfToken } = await (await request.get("/api/csrf-token")).json();

    const response = await request.post("/api/form", {
      data: { ...VALID_FORM, telefon: "1234567", csrfToken },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toBe(
      "Vennligst oppgi et gyldig telefonnummer",
    );
  });

  for (const method of ["GET", "PUT", "DELETE"] as const) {
    test(`${method} returns 405`, async ({ request }) => {
      const response = await request.fetch("/api/form", { method });

      expect(response.status()).toBe(405);
    });
  }
});

test.describe("POST /api/revalidate (negative cases only)", () => {
  // REVALIDATE_SECRET is not set in CI, so only rejection paths are tested here.
  // The success paths are covered by the Jest route tests with a mocked next/cache.

  test("returns 401 without a secret", async ({ request }) => {
    const response = await request.post("/api/revalidate?tag=projects");

    expect(response.status()).toBe(401);
    expect((await response.json()).message).toBe("Invalid secret token");
  });

  test("returns 401 with a wrong secret", async ({ request }) => {
    const response = await request.post(
      "/api/revalidate?secret=wrong&tag=projects",
    );

    expect(response.status()).toBe(401);
  });

  test("returns 401 even when the tag is missing", async ({ request }) => {
    // The secret is checked before the tag, so a bad secret never reaches the 400 branch
    const response = await request.post("/api/revalidate?secret=wrong");

    expect(response.status()).toBe(401);
  });
});
