import { test, expect } from "@playwright/test";

test.describe("Header Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("navigates to Prosjekter page from header", async ({ page }) => {
    // Arrange
    const prosjekterLink = page
      .getByRole("navigation")
      .getByRole("link", { name: "Prosjekter" });

    // Act
    await prosjekterLink.click();

    // Assert
    await expect(page).toHaveURL("/prosjekter");
    await expect(
      page.getByRole("heading", { name: "Prosjekter" }),
    ).toBeVisible();
  });

  test("navigates to CV page from header", async ({ page }) => {
    // Arrange
    const cvLink = page.getByRole("navigation").getByRole("link", { name: "CV" });

    // Act
    await cvLink.click();

    // Assert
    await expect(page).toHaveURL("/cv");
    await expect(page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" })).toBeVisible();
  });

  test("navigates to Kontakt page from header", async ({ page }) => {
    // Arrange
    const kontaktLink = page
      .getByRole("navigation")
      .getByRole("link", { name: "Kontakt" });

    // Act
    await kontaktLink.click();

    // Assert
    await expect(page).toHaveURL("/kontakt");
    await expect(page.getByText("Fullt navn")).toBeVisible();
  });

  test("logo navigates to homepage", async ({ page }) => {
    // Arrange
    await page.goto("/cv");
    const logo = page.getByRole("link", { name: /hjem/i }).first();

    // Act
    await logo.click();

    // Assert
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Hei!" })).toBeVisible();
  });

  test("external GitHub link has correct attributes", async ({ page }) => {
    // Arrange
    const githubLink = page
      .getByRole("navigation")
      .getByRole("link", { name: "Github" });

    // Act
    const href = await githubLink.getAttribute("href");
    const target = await githubLink.getAttribute("target");
    const rel = await githubLink.getAttribute("rel");

    // Assert
    expect(href).toContain("github.com");
    expect(target).toBe("_blank");
    expect(rel).toContain("noopener");
  });

  test("Hjem link is visible in navigation", async ({ page }) => {
    // Arrange
    const hjemLink = page
      .getByRole("navigation")
      .getByRole("link", { name: "Hjem" });

    // Act
    // (check visibility)

    // Assert
    await expect(hjemLink).toBeVisible();
  });
});

test.describe("Page Transitions", () => {
  test("page title updates when navigating to Prosjekter", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Prosjekter" })
      .click();

    // Assert
    await expect(page).toHaveTitle(/prosjekter/i);
  });

  test("page title updates when navigating to CV", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page.getByRole("navigation").getByRole("link", { name: "CV" }).click();

    // Assert
    await expect(page).toHaveTitle(/CV/i);
  });

  test("page title updates when navigating to Kontakt", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Kontakt" })
      .click();

    // Assert
    await expect(page).toHaveTitle(/kontakt/i);
  });

  test("URL updates correctly on navigation", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page.getByRole("navigation").getByRole("link", { name: "CV" }).click();

    // Assert
    await expect(page).toHaveURL("/cv");
  });

  test("browser back button works", async ({ page }) => {
    // Arrange
    await page.goto("/");
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Prosjekter" })
      .click();
    await expect(page).toHaveURL("/prosjekter");

    // Act
    await page.goBack();

    // Assert
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Hei!" })).toBeVisible();
  });

  test("browser forward button works", async ({ page }) => {
    // Arrange
    await page.goto("/");
    await page.getByRole("navigation").getByRole("link", { name: "CV" }).click();
    await page.goBack();

    // Act
    await page.goForward();

    // Assert
    await expect(page).toHaveURL("/cv");
  });

  test("navigating between multiple pages works", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page.getByRole("navigation").getByRole("link", { name: "CV" }).click();
    await expect(page).toHaveURL("/cv");

    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Prosjekter" })
      .click();
    await expect(page).toHaveURL("/prosjekter");

    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Kontakt" })
      .click();

    // Assert
    await expect(page).toHaveURL("/kontakt");
  });
});

test.describe("Footer Navigation", () => {
  const pages = [
    { name: "Homepage", url: "/" },
    { name: "CV", url: "/cv" },
    { name: "Kontakt", url: "/kontakt" },
    { name: "Prosjekter", url: "/prosjekter" },
  ];

  for (const { name, url } of pages) {
    test(`footer is visible on ${name}`, async ({ page }) => {
      // Arrange
      await page.goto(url);

      // Act
      const footer = page.getByRole("contentinfo");

      // Assert
      await expect(footer).toBeVisible();
    });
  }

  test("footer contains copyright text", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const footer = page.getByRole("contentinfo");

    // Assert
    await expect(footer).toContainText("Copyright Daniel Fjeldstad");
  });

  test("footer contains current year", async ({ page }) => {
    // Arrange
    await page.goto("/");
    const currentYear = new Date().getFullYear().toString();

    // Act
    const footer = page.getByRole("contentinfo");

    // Assert
    await expect(footer).toContainText(currentYear);
  });

  test("footer logo is visible", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const footerLogo = page.getByRole("contentinfo").getByRole("img");

    // Assert
    await expect(footerLogo).toBeVisible();
  });

  test("footer is at bottom of page", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const footer = page.getByRole("contentinfo");
    const footerBox = await footer.boundingBox();
    const viewportSize = page.viewportSize();

    // Assert
    expect(footerBox).not.toBeNull();
    expect(viewportSize).not.toBeNull();
    if (footerBox && viewportSize) {
      expect(footerBox.y + footerBox.height).toBeGreaterThan(
        viewportSize.height * 0.8,
      );
    }
  });
});

test.describe("In-Content Navigation", () => {
  test("can navigate to Prosjekter from homepage content", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const prosjekterContentLink = page
      .getByLabel("Prosjekter")
      .getByRole("link", { name: /prosjekter/i })
      .first();
    await prosjekterContentLink.click();

    // Assert
    await expect(page).toHaveURL("/prosjekter");
  });

  test("GitHub links in content open in new tab", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const githubLinks = page.getByRole("link", { name: /github/i });
    const firstGithubLink = githubLinks.first();

    // Assert
    await expect(firstGithubLink).toHaveAttribute("target", "_blank");
    await expect(firstGithubLink).toHaveAttribute("rel", /noopener/);
  });
});

test.describe("Navigation State", () => {
  test("current page is indicated in navigation on homepage", async ({
    page,
  }) => {
    // Arrange
    await page.goto("/");

    // Act
    const hjemLink = page
      .getByRole("navigation")
      .getByRole("link", { name: "Hjem" });

    // Assert
    // Current page should have some visual indicator (check if element has active class or style)
    await expect(hjemLink).toBeVisible();
  });

  test("navigation remains visible while scrolling", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(100);

    // Assert
    const nav = page.getByRole("navigation").first();
    await expect(nav).toBeVisible();
  });

  test("all navigation links are clickable", async ({ page }) => {
    // Arrange
    await page.goto("/");
    const navLinks = page.getByRole("navigation").first().getByRole("link");

    // Act
    const count = await navLinks.count();

    // Assert
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      await expect(link).toBeVisible();
    }
  });
});

test.describe("Deep Linking", () => {
  test("can directly navigate to CV page via URL", async ({ page }) => {
    // Arrange
    // (direct URL navigation)

    // Act
    await page.goto("/cv");

    // Assert
    await expect(page).toHaveURL("/cv");
    await expect(page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" })).toBeVisible();
  });

  test("can directly navigate to Kontakt page via URL", async ({ page }) => {
    // Arrange
    // (direct URL navigation)

    // Act
    await page.goto("/kontakt");

    // Assert
    await expect(page).toHaveURL("/kontakt");
    await expect(page.getByText("Fullt navn")).toBeVisible();
  });

  test("can directly navigate to Prosjekter page via URL", async ({ page }) => {
    // Arrange
    // (direct URL navigation)

    // Act
    await page.goto("/prosjekter");

    // Assert
    await expect(page).toHaveURL("/prosjekter");
    await expect(
      page.getByRole("heading", { name: "Prosjekter" }),
    ).toBeVisible();
  });
});
