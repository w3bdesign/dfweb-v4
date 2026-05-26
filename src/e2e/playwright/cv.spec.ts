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
    await page.getByRole("tab", { name: "Erfaring" }).click();

    // Check if a specific experience entry is visible
    await expect(
      page.getByRole("heading", { name: "– 2021 - NovaCare" }),
    ).toBeVisible();
  });

  test("displays Education section correctly", async ({ page }) => {
    await page.goto("/cv");

    // Click on 'Erfaring' tab
    await page.getByRole("tab", { name: "Utdanning" }).click();

    // Check if education information is present
    await expect(page.getByLabel("Utdanning")).toContainText(
      "2019 – 2026 - Kompetanseheving / egenlæring frontendutvikling",
    );
  });
});

/**
 * Helper: click a start tab for focus, press a key, and verify the expected tab receives focus.
 */
async function pressKeyAndExpectTab(
  page: import("@playwright/test").Page,
  startTabName: string,
  key: string,
  expectedTabName: string,
) {
  const startTab = page.getByRole("tab", { name: startTabName });
  await startTab.click();
  await page.keyboard.press(key);
  const expectedTab = page.getByRole("tab", { name: expectedTabName });
  await expect(expectedTab).toBeFocused();
  await expect(expectedTab).toHaveAttribute("aria-selected", "true");
}

test.describe("CV page — Tabs keyboard navigation (WAI-ARIA APG)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cv");
    await page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" }).waitFor();
  });

  test("ArrowDown moves focus to next tab", async ({ page }) => {
    await pressKeyAndExpectTab(page, "Nøkkelkvalifikasjoner", "ArrowDown", "Erfaring");
  });

  test("ArrowUp moves focus to previous tab", async ({ page }) => {
    await pressKeyAndExpectTab(page, "Erfaring", "ArrowUp", "Nøkkelkvalifikasjoner");
  });

  test("ArrowDown wraps from last tab to first tab", async ({ page }) => {
    await pressKeyAndExpectTab(page, "Frivillig arbeid", "ArrowDown", "Nøkkelkvalifikasjoner");
  });

  test("Home key moves focus to first tab", async ({ page }) => {
    await pressKeyAndExpectTab(page, "Erfaring", "Home", "Nøkkelkvalifikasjoner");
  });

  test("End key moves focus to last tab", async ({ page }) => {
    await pressKeyAndExpectTab(page, "Nøkkelkvalifikasjoner", "End", "Frivillig arbeid");
  });

  test("tablist has aria-orientation=vertical", async ({ page }) => {
    // Arrange & Act & Assert
    await expect(page.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
  });

  test("active tab has tabIndex=0, inactive tabs have tabIndex=-1", async ({ page }) => {
    // Arrange & Act & Assert
    await expect(page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" })).toHaveAttribute("tabindex", "0");
    await expect(page.getByRole("tab", { name: "Erfaring" })).toHaveAttribute("tabindex", "-1");
  });
});
