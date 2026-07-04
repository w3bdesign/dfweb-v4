import { test, expect } from "@playwright/test";

test.describe("Mobile Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
  });

  test("displays hamburger menu on mobile viewport", async ({ page }) => {
    // Arrange
    // (page loaded on mobile viewport)

    // Act
    const hamburger = page.getByTestId("hamburger");

    // Assert
    await expect(hamburger).toBeVisible();
    await expect(hamburger).toHaveAttribute("aria-expanded", "false");
    await expect(hamburger).toHaveAttribute("aria-label", "Åpne meny");
  });

  test("opens mobile menu when hamburger is clicked", async ({ page }) => {
    // Arrange
    const menuButton = page.getByTestId("hamburger");

    // Act
    await menuButton.click();

    // Assert
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(menuButton).toHaveAttribute("aria-label", "Lukk meny");
    await expect(page.getByTestId("mobile-menu")).toBeVisible();
    await expect(page.getByTestId("mobil-Hjem")).toBeVisible();
    await expect(page.getByTestId("mobil-Prosjekter")).toBeVisible();
    await expect(page.getByTestId("mobil-CV")).toBeVisible();
    await expect(page.getByTestId("mobil-Kontakt")).toBeVisible();
  });

  test("closes mobile menu when hamburger is clicked again", async ({ page }) => {
    // Arrange
    const menuButton = page.getByTestId("hamburger");
    await menuButton.click();
    await expect(page.getByTestId("mobile-menu")).toBeVisible();

    // Act
    await menuButton.click();

    // Assert
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByTestId("mobile-menu")).not.toBeVisible();
  });

  test("navigates to correct page when menu link clicked", async ({ page }) => {
    // Arrange
    await page.getByTestId("hamburger").click();

    // Act
    await page.getByTestId("mobil-Prosjekter").click();

    // Assert
    await expect(page).toHaveURL("/prosjekter");
    await expect(
      page.getByRole("heading", { name: "Prosjekter" }),
    ).toBeVisible();
  });

  test("shows active/current page in mobile menu", async ({ page }) => {
    // Arrange
    await page.goto("/cv");
    await page.getByTestId("hamburger").click();

    // Act
    const cvLink = page.getByTestId("mobil-CV");

    // Assert
    await expect(cvLink).toHaveClass(/text-\[var\(--matrix-light\)\]/);
  });

  test("external GitHub link has correct attributes", async ({ page }) => {
    // Arrange
    await page.getByTestId("hamburger").click();

    // Act
    const githubLink = page.getByTestId("mobil-Github");

    // Assert
    await expect(githubLink).toHaveAttribute("target", "_blank");
    await expect(githubLink).toHaveAttribute("rel", "noreferrer");
    await expect(githubLink).toHaveAttribute("href", /.+github\.com.+/);
  });

  test("menu closes after navigating to internal link", async ({ page }) => {
    // Arrange
    await page.getByTestId("hamburger").click();
    await expect(page.getByTestId("mobile-menu")).toBeVisible();

    // Act
    await page.getByTestId("mobil-CV").click();

    // Assert
    await expect(page.getByTestId("mobile-menu")).not.toBeVisible();
  });
});

test.describe("Mobile Menu Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test("mobile menu has correct ARIA attributes", async ({ page }) => {
    // Arrange
    await page.goto("/");
    await page.getByTestId("hamburger").click();

    // Act
    const nav = page.getByRole("navigation", { name: "Mobilnavigasjon" });

    // Assert
    await expect(nav).toBeVisible();
  });

  test("hamburger button aria-label updates when menu opens", async ({ page }) => {
    // Arrange
    await page.goto("/");
    const hamburger = page.getByTestId("hamburger");

    // Act
    await expect(hamburger).toHaveAttribute("aria-label", "Åpne meny");
    await hamburger.click();

    // Assert
    await expect(hamburger).toHaveAttribute("aria-label", "Lukk meny");
  });

  test("screen reader text updates correctly", async ({ page }) => {
    // Arrange
    await page.goto("/");
    const hamburger = page.getByTestId("hamburger");

    // Act
    const closedText = hamburger.locator(".sr-only");
    await expect(closedText).toHaveText("Åpne navigasjonsmeny");

    await hamburger.click();
    await page.waitForTimeout(100);

    // Assert
    await expect(closedText).toHaveText("Lukk navigasjonsmeny");
  });
});

test.describe("Responsive Behavior", () => {
  test("switches from desktop to mobile navigation at breakpoint", async ({
    page,
  }) => {
    // Arrange - Desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    // Act
    const hamburgerDesktop = page.getByTestId("hamburger");

    // Assert - Hamburger hidden on desktop
    await expect(hamburgerDesktop).not.toBeVisible();

    // Act - Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Assert - Hamburger visible on mobile
    await expect(hamburgerDesktop).toBeVisible();
  });

  test("mobile menu works correctly after viewport resize", async ({ page }) => {
    // Arrange
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");
    await page.setViewportSize({ width: 375, height: 667 });

    // Act
    await page.getByTestId("hamburger").click();

    // Assert
    await expect(page.getByTestId("mobile-menu")).toBeVisible();
    await expect(page.getByTestId("mobil-Hjem")).toBeVisible();
  });
});

test.describe("Mobile Menu on All Pages", () => {
  const pages = [
    { name: "Homepage", url: "/" },
    { name: "CV", url: "/cv" },
    { name: "Kontakt", url: "/kontakt" },
    { name: "Prosjekter", url: "/prosjekter" },
  ];

  for (const { name, url } of pages) {
    test(`mobile menu works on ${name}`, async ({ page }) => {
      // Arrange
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(url);

      // Act
      await page.getByTestId("hamburger").click();

      // Assert
      await expect(page.getByTestId("mobile-menu")).toBeVisible();
      await expect(page.getByTestId("mobil-Hjem")).toBeVisible();
    });
  }
});
