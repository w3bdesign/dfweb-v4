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

    // Check project description
    await expect(portfolioContent).toContainText(
      "Fullstack strategispill inspirert av Planetarion. Prosjektet inkluderer innlogging, database, grafer, responsivt design med mer.",
    );

    // Check project technologies
    await expect(portfolioContent).toContainText(
      "Typescript, Tailwind, Prisma, Clerk, tRPC, mySQL, Chart.js",
    );

    // Check if 'Besøk' and 'GitHub' links are visible
    await expect(page.getByText("BesøkGitHub").first()).toBeVisible();
  });
});
