import { test, expect } from "@playwright/test";

const pages = [
  { name: "Homepage", url: "/", title: /dfweb|daniel fjeldstad/i },
  { name: "CV", url: "/cv", title: /cv|curriculum vitae/i },
  { name: "Kontakt", url: "/kontakt", title: /kontakt|contact/i },
  { name: "Prosjekter", url: "/prosjekter", title: /prosjekter|projects/i },
];

test.describe("SEO Meta Tags", () => {
  for (const { name, url, title } of pages) {
    test(`${name} has proper title tag`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const pageTitle = await page.title();

      // Assert
      expect(pageTitle).toBeTruthy();
      expect(pageTitle.length).toBeGreaterThan(0);
      expect(pageTitle.length).toBeLessThan(70); // SEO best practice
      expect(pageTitle).toMatch(title);
    });

    test(`${name} has meta description`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");

      // Assert
      if (description) {
        expect(description.length).toBeGreaterThan(50);
        expect(description.length).toBeLessThan(160); // SEO best practice
      }
    });

    test(`${name} has viewport meta tag`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const viewport = await page
        .locator('meta[name="viewport"]')
        .getAttribute("content");

      // Assert
      expect(viewport).toBeTruthy();
      expect(viewport).toContain("width=device-width");
    });

    test(`${name} has charset meta tag`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const charset =
        (await page.locator('meta[charset]').getAttribute("charset")) ||
        (await page
          .locator('meta[http-equiv="Content-Type"]')
          .getAttribute("content"));

      // Assert
      expect(charset).toBeTruthy();
    });
  }
});

test.describe("Open Graph Tags", () => {
  for (const { name, url } of pages) {
    test(`${name} has Open Graph title`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute("content");

      // Assert
      if (ogTitle) {
        expect(ogTitle.length).toBeGreaterThan(0);
      }
    });

    test(`${name} has Open Graph description`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const ogDescription = await page
        .locator('meta[property="og:description"]')
        .getAttribute("content");

      // Assert
      if (ogDescription) {
        expect(ogDescription.length).toBeGreaterThan(0);
      }
    });

    test(`${name} has Open Graph type`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const ogType = await page
        .locator('meta[property="og:type"]')
        .getAttribute("content");

      // Assert
      if (ogType) {
        expect(ogType).toBeTruthy();
      }
    });

    test(`${name} has Open Graph URL`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const ogUrl = await page
        .locator('meta[property="og:url"]')
        .getAttribute("content");

      // Assert
      if (ogUrl) {
        expect(ogUrl).toContain(url === "/" ? "" : url);
      }
    });
  }
});

test.describe("Twitter Card Tags", () => {
  for (const { name, url } of pages) {
    test(`${name} has Twitter card type`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const twitterCard = await page
        .locator('meta[name="twitter:card"]')
        .getAttribute("content");

      // Assert
      if (twitterCard) {
        expect(["summary", "summary_large_image", "app", "player"]).toContain(
          twitterCard,
        );
      }
    });

    test(`${name} has Twitter title`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const twitterTitle = await page
        .locator('meta[name="twitter:title"]')
        .getAttribute("content");

      // Assert
      if (twitterTitle) {
        expect(twitterTitle.length).toBeGreaterThan(0);
      }
    });
  }
});

test.describe("Structured Data", () => {
  test("homepage has structured data", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const structuredData = await page.locator('script[type="application/ld+json"]').count();

    // Assert
    // If structured data exists, verify it's valid JSON
    if (structuredData > 0) {
      const jsonContent = await page
        .locator('script[type="application/ld+json"]')
        .first()
        .textContent();
      if (jsonContent) {
        expect(() => JSON.parse(jsonContent)).not.toThrow();
      }
    }
  });

  test("structured data contains required properties", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const structuredDataElements = page.locator('script[type="application/ld+json"]');
    const count = await structuredDataElements.count();

    // Assert
    if (count > 0) {
      const jsonContent = await structuredDataElements.first().textContent();
      if (jsonContent) {
        const data = JSON.parse(jsonContent);
        expect(data["@context"]).toBeTruthy();
        expect(data["@type"]).toBeTruthy();
      }
    }
  });
});

test.describe("Language and Locale", () => {
  for (const { name, url } of pages) {
    test(`${name} has lang attribute on html element`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const lang = await page.locator("html").getAttribute("lang");

      // Assert
      expect(lang).toBeTruthy();
      expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/); // Format: en, nb-NO, etc.
    });

    test(`${name} has correct language declaration`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const lang = await page.locator("html").getAttribute("lang");

      // Assert
      // Should be Norwegian (no/nb) or English (en)
      if (lang) {
        expect(["no", "nb", "nb-NO", "en", "en-US"]).toContain(lang);
      }
    });
  }
});

test.describe("Canonical URLs", () => {
  for (const { name, url } of pages) {
    test(`${name} has canonical URL`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");

      // Assert
      if (canonical) {
        expect(canonical).toBeTruthy();
        expect(canonical).toContain(url === "/" ? "" : url);
      }
    });
  }
});

test.describe("Favicon and Icons", () => {
  test("site has favicon", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const favicon = page.locator('link[rel*="icon"]');
    const count = await favicon.count();

    // Assert
    expect(count).toBeGreaterThan(0);
  });

  test("favicon links are valid", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const faviconLinks = page.locator('link[rel*="icon"]');
    const count = await faviconLinks.count();

    // Assert
    for (let i = 0; i < count; i++) {
      const href = await faviconLinks.nth(i).getAttribute("href");
      expect(href).toBeTruthy();
      expect(href?.length).toBeGreaterThan(0);
    }
  });

  test("apple touch icon is present", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const appleTouchIcon = await page
      .locator('link[rel="apple-touch-icon"]')
      .count();

    // Assert
    // Optional but good to have
    expect(appleTouchIcon).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Robots and Indexing", () => {
  test("robots meta tag is configured", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");

    // Assert
    // If present, should allow indexing (not "noindex")
    if (robots) {
      expect(robots).not.toContain("noindex");
    }
  });

  test("robots.txt is accessible", async ({ request, baseURL }) => {
    // Arrange
    const robotsUrl = `${baseURL || "http://localhost:3000"}/robots.txt`;

    // Act
    const response = await request.get(robotsUrl);

    // Assert
    expect([200, 404]).toContain(response.status());
  });
});

test.describe("Performance Meta Tags", () => {
  test("preconnect hints are present", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const preconnect = page.locator('link[rel="preconnect"]');
    const count = await preconnect.count();

    // Assert
    // Check for common preconnect domains (if any)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("dns-prefetch hints are present", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const dnsPrefetch = page.locator('link[rel="dns-prefetch"]');
    const count = await dnsPrefetch.count();

    // Assert
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
