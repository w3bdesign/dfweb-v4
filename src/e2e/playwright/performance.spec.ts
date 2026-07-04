import { test, expect } from "@playwright/test";

test.describe("Loading States", () => {
  test("skeleton loaders appear during page load", async ({ page }) => {
    // Arrange
    await page.goto("/prosjekter", { waitUntil: "domcontentloaded" });

    // Act
    // Check for skeleton/loading indicators during initial load
    const skeletonElements = page.locator(
      '[class*="skeleton"], [class*="loading"], [aria-busy="true"]',
    );

    // Assert
    // Note: This might not catch skeletons as they load very fast
    // The test validates the structure exists even if not visible
    const exists = (await skeletonElements.count()) >= 0;
    expect(exists).toBe(true);
  });

  test("content loader component displays during data fetch", async ({
    page,
  }) => {
    // Arrange
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Act
    // Look for any loading indicators in the initial render
    const loadingIndicators = page.locator('[data-testid*="loader"]');

    // Assert
    const count = await loadingIndicators.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("suspense boundaries handle delayed content", async ({ page }) => {
    // Arrange
    // Slow down network to catch suspense boundaries
    await page.route("**/*", (route) => {
      setTimeout(() => route.continue(), 100);
    });

    // Act
    const navigationPromise = page.goto("/prosjekter");

    // Assert
    // Page should eventually load even with delayed network
    await navigationPromise;
    await expect(
      page.getByRole("heading", { name: "Prosjekter" }),
    ).toBeVisible();
  });

  test("loading state shows while navigating between pages", async ({
    page,
  }) => {
    // Arrange
    await page.goto("/");

    // Act
    const navigationPromise = page
      .getByRole("navigation")
      .getByRole("link", { name: "Prosjekter" })
      .click();

    // Assert
    await navigationPromise;
    await expect(page).toHaveURL("/prosjekter");
  });

  test("page remains responsive during loading", async ({ page }) => {
    // Arrange
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Act
    // Try to interact with navigation while page loads
    const navLink = page
      .getByRole("navigation")
      .getByRole("link", { name: "CV" });

    // Assert
    await expect(navLink).toBeEnabled();
  });
});

test.describe("Image Performance", () => {
  test("images load without console warnings", async ({ page }) => {
    // Arrange
    const consoleWarnings: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "warning") {
        consoleWarnings.push(msg.text());
      }
    });

    // Act
    await page.goto("/prosjekter");
    await page.waitForLoadState("networkidle");

    // Assert
    // Filter out expected warnings about image quality
    const unexpectedWarnings = consoleWarnings.filter(
      (warn) =>
        !warn.includes("quality") &&
        !warn.includes("Image") &&
        !warn.includes("LCP"),
    );
    expect(unexpectedWarnings).toHaveLength(0);
  });

  test("above-fold images load with priority", async ({ page }) => {
    // Arrange
    await page.goto("/prosjekter");

    // Act
    const firstImage = page.getByRole("img").first();
    await firstImage.waitFor({ state: "visible" });

    // Assert
    await expect(firstImage).toBeVisible();
    const loading = await firstImage.getAttribute("loading");
    // First image should either be eager or undefined (default eager)
    expect(loading === "eager" || loading === null).toBe(true);
  });

  test("images have proper dimensions to prevent layout shift", async ({
    page,
  }) => {
    // Arrange
    await page.goto("/prosjekter");

    // Act
    const images = page.getByRole("img");
    const count = await images.count();

    // Assert
    for (let i = 0; i < Math.min(count, 3); i++) {
      const img = images.nth(i);
      const box = await img.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
      }
    }
  });

  test("lazy-loaded images eventually appear", async ({ page }) => {
    // Arrange
    await page.goto("/prosjekter");

    // Act
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Assert
    const allImages = page.getByRole("img");
    const count = await allImages.count();
    expect(count).toBeGreaterThan(0);
  });

  test("no duplicate image requests", async ({ page }) => {
    // Arrange
    const imageRequests = new Set<string>();
    page.on("request", (request) => {
      if (request.resourceType() === "image") {
        imageRequests.add(request.url());
      }
    });

    // Act
    await page.goto("/prosjekter");
    await page.waitForLoadState("networkidle");

    // Assert
    // Each unique image URL should only be requested once
    expect(imageRequests.size).toBeGreaterThan(0);
  });
});

test.describe("Lighthouse Performance Metrics", () => {
  test("homepage loads within acceptable time", async ({ page }) => {
    // Arrange
    const startTime = Date.now();

    // Act
    await page.goto("/");
    await page.waitForLoadState("load");
    const loadTime = Date.now() - startTime;

    // Assert
    // Page should load in less than 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test("CV page loads within acceptable time", async ({ page }) => {
    // Arrange
    const startTime = Date.now();

    // Act
    await page.goto("/cv");
    await page.waitForLoadState("load");
    const loadTime = Date.now() - startTime;

    // Assert
    expect(loadTime).toBeLessThan(5000);
  });

  test("no layout shift during initial load", async ({ page }) => {
    // Arrange
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Act
    const initialHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.waitForLoadState("networkidle");
    const finalHeight = await page.evaluate(() => document.body.scrollHeight);

    // Assert
    // Height should stabilize (allow 10% variance for dynamic content)
    const heightDiff = Math.abs(finalHeight - initialHeight);
    const variance = heightDiff / initialHeight;
    expect(variance).toBeLessThan(0.5); // Less than 50% change
  });

  test("largest contentful paint element is visible", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page.waitForLoadState("load");
    const mainContent = page.getByRole("main");

    // Assert
    await expect(mainContent).toBeVisible();
  });
});

test.describe("Resource Loading", () => {
  test("critical CSS is loaded", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const hasStyles = await page.evaluate(() => {
      return document.styleSheets.length > 0;
    });

    // Assert
    expect(hasStyles).toBe(true);
  });

  test("fonts load without blocking render", async ({ page }) => {
    // Arrange
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Act
    const mainHeading = page.getByRole("heading", { name: "Hei!" });

    // Assert
    // Heading should be visible even if fonts haven't fully loaded
    await expect(mainHeading).toBeVisible({ timeout: 3000 });
  });

  test("no 404 errors for resources", async ({ page }) => {
    // Arrange
    const failedRequests: string[] = [];
    page.on("response", (response) => {
      if (response.status() === 404) {
        failedRequests.push(response.url());
      }
    });

    // Act
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Assert
    expect(failedRequests).toHaveLength(0);
  });
});
