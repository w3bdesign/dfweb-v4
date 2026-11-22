import { test, expect } from "@playwright/test";

/** HTTP-level rejection tests for the Sanity revalidation webhook. */
test.describe("POST /api/revalidate (negative cases only)", () => {
  // REVALIDATE_SECRET is not set in CI, so only rejection paths are tested here.
  // The success paths are covered by the Vitest route tests with a mocked next/cache.

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
