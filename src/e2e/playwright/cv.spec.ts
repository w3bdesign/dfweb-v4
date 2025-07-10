import { test, expect } from "@playwright/test";

test.describe("CV page", () => {
  test("loads and displays main content correctly", async ({ page }) => {
    await page.goto("/cv");

    // Check if 'Nøkkelkvalifikasjoner' tab is visible
    await expect(
      page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" }),
    ).toBeVisible();
  });

  test("navigates to and displays Experience section correctly", async ({
    page,
  }) => {
    await page.goto("/cv");

    // Click on 'Erfaring' tab
    await page.getByText("Erfaring").click();

    // Check if a specific experience entry is visible
    await expect(
      page.getByRole("heading", { name: "– 2021 - NovaCare" }),
    ).toBeVisible();
  });

  test("displays Education section correctly", async ({ page }) => {
    await page.goto("/cv");

    // Click on 'Erfaring' tab
    await page.getByText("Utdanning").click();

    // Check if education information is present
    await expect(page.getByLabel("Utdanning")).toContainText(
      "2019 – 2025 - Kompetanseheving / egenlæring frontendutvikling",
    );
  });
});
