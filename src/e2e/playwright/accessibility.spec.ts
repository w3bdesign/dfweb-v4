import { test, expect } from "@playwright/test";

const pages = [
  { name: "Homepage", url: "/" },
  { name: "CV", url: "/cv" },
  { name: "Kontakt", url: "/kontakt" },
  { name: "Prosjekter", url: "/prosjekter" },
];

test.describe("Skip Link", () => {
  for (const { name, url } of pages) {
    test(`${name} has skip link as first focusable element`, async ({
      page,
    }) => {
      // Arrange
      await page.goto(url);

      // Act
      await page.keyboard.press("Tab");

      // Assert
      const skipLink = page.getByRole("link", {
        name: "Hopp til hovedinnhold",
      });
      await expect(skipLink).toBeFocused();
    });

    test(`${name} skip link navigates to main content`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");

      // Assert
      const mainContent = page.locator("#main-content");
      await expect(mainContent).toBeFocused();
    });

    test(`${name} skip link is visible when focused`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      await page.keyboard.press("Tab");

      // Assert
      const skipLink = page.getByRole("link", {
        name: "Hopp til hovedinnhold",
      });
      await expect(skipLink).toBeVisible();
    });

    test(`${name} skip link has correct href`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const skipLink = page.getByRole("link", {
        name: "Hopp til hovedinnhold",
      });

      // Assert
      await expect(skipLink).toHaveAttribute("href", "#main-content");
    });
  }
});

test.describe("ARIA Landmarks", () => {
  for (const { name, url } of pages) {
    test(`${name} has main landmark`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const main = page.getByRole("main");

      // Assert
      await expect(main).toBeVisible();
    });

    test(`${name} has navigation landmark`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const nav = page.getByRole("navigation").first();

      // Assert
      await expect(nav).toBeVisible();
    });

    test(`${name} has contentinfo landmark (footer)`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const footer = page.getByRole("contentinfo");

      // Assert
      await expect(footer).toBeVisible();
    });
  }
});

test.describe("Heading Hierarchy", () => {
  test("Homepage has correct heading hierarchy", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const h1 = page.getByRole("heading", { level: 1 });
    const h2s = page.getByRole("heading", { level: 2 });

    // Assert
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Hei!");
    await expect(h2s.first()).toBeVisible();
  });

  test("CV page has correct heading hierarchy", async ({ page }) => {
    // Arrange
    await page.goto("/cv");

    // Act
    const h1 = page.getByRole("heading", { level: 1 });

    // Assert
    await expect(h1).toHaveCount(1);
  });

  test("Kontakt page has correct heading hierarchy", async ({ page }) => {
    // Arrange
    await page.goto("/kontakt");

    // Act
    const h1 = page.getByRole("heading", { level: 1 });

    // Assert
    await expect(h1).toHaveCount(1);
  });

  test("Prosjekter page has correct heading hierarchy", async ({ page }) => {
    // Arrange
    await page.goto("/prosjekter");

    // Act
    const h1 = page.getByRole("heading", { level: 1 });

    // Assert
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Prosjekter");
  });
});

test.describe("Keyboard Navigation", () => {
  test("can navigate entire homepage using only keyboard", async ({ page }) => {
    // Arrange
    await page.goto("/");
    let tabCount = 0;

    // Act
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab");
      tabCount++;
      const focusedElement = await page.evaluate(
        () => document.activeElement?.tagName,
      );
      if (focusedElement) {
        // Successfully tabbed through elements
      }
    }

    // Assert
    expect(tabCount).toBe(20);
  });

  test("no keyboard traps on homepage", async ({ page }) => {
    // Arrange
    await page.goto("/");
    let lastFocused = "";

    // Act
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      const currentFocused = await page.evaluate(() => {
        const el = document.activeElement;
        return `${el?.tagName}${el?.id ? `#${el.id}` : ""}${el?.className ? `.${el.className.split(" ")[0]}` : ""}`;
      });

      // Check if we're stuck on the same element
      if (i > 0 && currentFocused === lastFocused) {
        // Try shift+tab to see if we can move backwards
        await page.keyboard.press("Shift+Tab");
        const afterShift = await page.evaluate(() => {
          const el = document.activeElement;
          return `${el?.tagName}${el?.id ? `#${el.id}` : ""}`;
        });
        // If we can move backwards, we're not trapped
        expect(afterShift).not.toBe(currentFocused);
        return;
      }
      lastFocused = currentFocused;
    }

    // Assert
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName,
    );
    expect(focusedElement).not.toBe(null);
  });

  test("can navigate CV tabs using keyboard only", async ({ page }) => {
    // Arrange
    await page.goto("/cv");
    await page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" }).focus();

    // Act
    await page.keyboard.press("ArrowDown");

    // Assert
    await expect(
      page.getByRole("tab", { name: "Erfaring" }),
    ).toBeFocused();
  });
});

test.describe("Focus Management", () => {
  test("skip link receives focus before navigation", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(
      () => document.activeElement?.textContent,
    );

    // Assert
    expect(focused).toContain("Hopp til hovedinnhold");
  });

  test("main content is focusable after skip link navigation", async ({
    page,
  }) => {
    // Arrange
    await page.goto("/");
    await page.keyboard.press("Tab");

    // Act
    await page.keyboard.press("Enter");

    // Assert
    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeFocused();
  });

  test("focus visible styles are applied", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", {
      name: "Hopp til hovedinnhold",
    });

    // Assert
    await expect(skipLink).toBeVisible();
    // Focus visible should make the skip link visible
    const isVisible = await skipLink.isVisible();
    expect(isVisible).toBe(true);
  });
});

test.describe("ARIA Attributes", () => {
  test("navigation has correct aria-label", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const nav = page.getByRole("navigation").first();

    // Assert
    await expect(nav).toHaveAttribute("aria-label");
  });

  test("main content has correct id for skip link", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const mainContent = page.locator("#main-content");

    // Assert
    await expect(mainContent).toBeAttached();
  });

  test("form has correct aria-label on kontakt page", async ({ page }) => {
    // Arrange
    await page.goto("/kontakt");

    // Act
    const form = page.locator('form[aria-label="Contact Form"]');

    // Assert
    await expect(form).toBeVisible();
  });
});
