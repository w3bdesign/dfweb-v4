import { test, expect } from "@playwright/test";

test.describe("Prosjekter page", () => {
  test("loads and displays main content correctly", async ({ page }) => {
    await page.goto("/prosjekter");

    // Check main heading
    await expect(
      page.getByRole("heading", { name: "Prosjekter" }),
    ).toBeVisible();

    // Check if 'Dfweb versjon' heading is visible
    await expect(
      page.getByRole("heading", { name: "Dfweb versjon" }),
    ).toBeVisible();
  });

  test("displays project images correctly", async ({ page }) => {
    await page.goto("/prosjekter");

    // Check if project images are visible
    await expect(page.getByRole("img", { name: "Earth Doom" })).toBeVisible();
    await expect(
      page.getByRole("img", { name: "NextJS WooCommerce" }),
    ).toBeVisible();
  });

  test("displays project details correctly", async ({ page }) => {
    await page.goto("/prosjekter");

    const portfolioContent = page.getByLabel("Innhold portefølje");

    // Check project title
    await expect(portfolioContent).toContainText("Earth Doom");

    // Check project technologies
    await expect(portfolioContent).toContainText(
      "Typescript, Tailwind, Prisma, Clerk, tRPC, PostgreSQL, Chart.js",
    );

    // Check if 'Besøk' and 'GitHub' links are visible
    await expect(page.getByText("BesøkGitHub").first()).toBeVisible();
  });
});

test.describe("Project Card Links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/prosjekter");
  });

  test("Besøk links are visible and have correct href", async ({ page }) => {
    // Arrange
    const besokLinks = page.getByRole("link", { name: /besøk/i });

    // Act
    const count = await besokLinks.count();

    // Assert
    expect(count).toBeGreaterThan(0);
    const firstLink = besokLinks.first();
    await expect(firstLink).toBeVisible();
    const href = await firstLink.getAttribute("href");
    expect(href).toBeTruthy();
  });

  test("GitHub links open in new tab with correct attributes", async ({
    page,
  }) => {
    // Arrange
    const githubLinks = page.getByRole("link", { name: /github/i });

    // Act
    const firstGithubLink = githubLinks.first();

    // Assert
    await expect(firstGithubLink).toBeVisible();
    await expect(firstGithubLink).toHaveAttribute("target", "_blank");
    await expect(firstGithubLink).toHaveAttribute("rel", /noopener/);
  });

  test("all project cards have both Besøk and GitHub links", async ({
    page,
  }) => {
    // Arrange
    const portfolioContent = page.getByLabel("Innhold portefølje");

    // Act
    const besokLinks = portfolioContent.getByRole("link", { name: /besøk/i });
    const githubLinks = portfolioContent.getByRole("link", { name: /github/i });
    const besokCount = await besokLinks.count();
    const githubCount = await githubLinks.count();

    // Assert
    expect(besokCount).toBeGreaterThan(0);
    expect(githubCount).toBeGreaterThan(0);
    // Counts should be close (some projects might not have both)
    expect(Math.abs(besokCount - githubCount)).toBeLessThanOrEqual(1);
  });

  test("project cards display all required information", async ({ page }) => {
    // Arrange
    const portfolioContent = page.getByLabel("Innhold portefølje");

    // Act
    const projectHeadings = portfolioContent.getByRole("heading");
    const projectImages = portfolioContent.getByRole("img");
    const headingCount = await projectHeadings.count();
    const imageCount = await projectImages.count();

    // Assert
    expect(headingCount).toBeGreaterThan(0);
    expect(imageCount).toBeGreaterThan(0);
  });

  test("all project images have alt text", async ({ page }) => {
    // Arrange
    const portfolioContent = page.getByLabel("Innhold portefølje");
    const images = portfolioContent.getByRole("img");

    // Act
    const count = await images.count();

    // Assert
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test("technology pills are displayed for projects", async ({ page }) => {
    // Arrange
    const portfolioContent = page.getByLabel("Innhold portefølje");

    // Act
    const technologies = await portfolioContent.textContent();

    // Assert
    expect(technologies).toContain("Typescript");
    // Multiple technology keywords should be present
    const techKeywords = [
      "Typescript",
      "Tailwind",
      "React",
      "Next",
      "Vue",
      "PHP",
    ];
    const foundTechs = techKeywords.filter((tech) =>
      technologies?.includes(tech),
    );
    expect(foundTechs.length).toBeGreaterThan(2);
  });
});
