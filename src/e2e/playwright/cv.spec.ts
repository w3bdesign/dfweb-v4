import { test, expect } from "@playwright/test";

const keyboardNavigationCases = [
  { name: "ArrowDown moves focus to next tab", start: "Nøkkelkvalifikasjoner", key: "ArrowDown", expected: "Erfaring" },
  { name: "ArrowUp moves focus to previous tab", start: "Erfaring", key: "ArrowUp", expected: "Nøkkelkvalifikasjoner" },
  { name: "ArrowDown wraps from last tab to first tab", start: "Frivillig arbeid", key: "ArrowDown", expected: "Nøkkelkvalifikasjoner" },
  { name: "Home key moves focus to first tab", start: "Erfaring", key: "Home", expected: "Nøkkelkvalifikasjoner" },
  { name: "End key moves focus to last tab", start: "Nøkkelkvalifikasjoner", key: "End", expected: "Frivillig arbeid" },
] as const;

test.describe("CV page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cv");
    await page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" }).waitFor();
  });

  test("loads and displays main content correctly", async ({ page }) => {
    await expect(
      page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" }),
    ).toBeVisible();
  });

  test("navigates to and displays Experience section correctly", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: "Erfaring" }).click();

    await expect(
      page.getByRole("heading", { name: "– 2021 - NovaCare" }),
    ).toBeVisible();
  });

  test("displays Education section correctly", async ({ page }) => {
    await page.getByRole("tab", { name: "Utdanning" }).click();

    await expect(page.getByLabel("Utdanning")).toContainText(
      "2019 – 2026 - Kompetanseheving / egenlæring frontendutvikling",
    );
  });

  for (const { name, start, key, expected } of keyboardNavigationCases) {
    test(name, async ({ page }) => {
      const startTab = page.getByRole("tab", { name: start });
      await startTab.click();
      await page.keyboard.press(key);
      const expectedTab = page.getByRole("tab", { name: expected });
      await expect(expectedTab).toBeFocused();
      await expect(expectedTab).toHaveAttribute("aria-selected", "true");
    });
  }

  test("tablist has aria-orientation=vertical", async ({ page }) => {
    await expect(page.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
  });

  test("active tab has tabIndex=0, inactive tabs have tabIndex=-1", async ({ page }) => {
    await expect(page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" })).toHaveAttribute("tabindex", "0");
    await expect(page.getByRole("tab", { name: "Erfaring" })).toHaveAttribute("tabindex", "-1");
  });
});
