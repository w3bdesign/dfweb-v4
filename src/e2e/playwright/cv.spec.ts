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

test.describe("CV page — Tabs keyboard navigation (WAI-ARIA APG)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cv");
  });

  test("navigates tabs with ArrowDown key in vertical orientation", async ({
    page,
  }) => {
    const firstTab = page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" });
    const secondTab = page.getByRole("tab", { name: "Erfaring" });

    // Focus the first tab
    await firstTab.focus();
    await expect(firstTab).toBeFocused();

    // Press ArrowDown to move to the next tab
    await page.keyboard.press("ArrowDown");
    await expect(secondTab).toBeFocused();
    await expect(secondTab).toHaveAttribute("aria-selected", "true");
  });

  test("navigates tabs with ArrowUp key in vertical orientation", async ({
    page,
  }) => {
    const firstTab = page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" });
    const secondTab = page.getByRole("tab", { name: "Erfaring" });

    // Focus the second tab by clicking it first, then use keyboard
    await secondTab.click();
    await secondTab.focus();

    // Press ArrowUp to move to the previous tab
    await page.keyboard.press("ArrowUp");
    await expect(firstTab).toBeFocused();
    await expect(firstTab).toHaveAttribute("aria-selected", "true");
  });

  test("wraps from last tab to first tab on ArrowDown", async ({ page }) => {
    const firstTab = page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" });
    const tabs = page.getByRole("tab");
    const lastTab = tabs.last();

    // Click and focus the last tab
    await lastTab.click();
    await lastTab.focus();

    // Press ArrowDown should wrap to first tab
    await page.keyboard.press("ArrowDown");
    await expect(firstTab).toBeFocused();
    await expect(firstTab).toHaveAttribute("aria-selected", "true");
  });

  test("Home key moves focus to first tab", async ({ page }) => {
    const firstTab = page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" });
    const secondTab = page.getByRole("tab", { name: "Erfaring" });

    // Click the second tab, then press Home
    await secondTab.click();
    await secondTab.focus();
    await page.keyboard.press("Home");

    await expect(firstTab).toBeFocused();
    await expect(firstTab).toHaveAttribute("aria-selected", "true");
  });

  test("End key moves focus to last tab", async ({ page }) => {
    const firstTab = page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" });
    const tabs = page.getByRole("tab");
    const lastTab = tabs.last();

    // Focus the first tab, then press End
    await firstTab.focus();
    await page.keyboard.press("End");

    await expect(lastTab).toBeFocused();
    await expect(lastTab).toHaveAttribute("aria-selected", "true");
  });

  test("tablist has aria-orientation attribute", async ({ page }) => {
    const tablist = page.getByRole("tablist");
    await expect(tablist).toHaveAttribute("aria-orientation", "vertical");
  });

  test("only active tab has tabIndex=0, inactive tabs have tabIndex=-1", async ({
    page,
  }) => {
    const firstTab = page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" });
    const secondTab = page.getByRole("tab", { name: "Erfaring" });

    // First tab is active by default
    await expect(firstTab).toHaveAttribute("tabindex", "0");
    await expect(secondTab).toHaveAttribute("tabindex", "-1");
  });
});
