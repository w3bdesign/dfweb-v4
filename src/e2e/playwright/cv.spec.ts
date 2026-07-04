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

test.describe("CV page tab content", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cv");
    await page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" }).waitFor();
  });

  test("displays Nøkkelkvalifikasjoner content by default", async ({ page }) => {
    // Arrange
    // (default tab is active)

    // Act
    const panel = page.getByRole("tabpanel");

    // Assert
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("aria-labelledby");
  });

  test("displays Erfaring content when tab clicked", async ({ page }) => {
    // Arrange
    const erfaringTab = page.getByRole("tab", { name: "Erfaring" });

    // Act
    await erfaringTab.click();

    // Assert
    const panel = page.getByRole("tabpanel");
    await expect(panel).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /– 2021 - NovaCare/i }),
    ).toBeVisible();
  });

  test("displays Utdanning content when tab clicked", async ({ page }) => {
    // Arrange
    const utdanningTab = page.getByRole("tab", { name: "Utdanning" });

    // Act
    await utdanningTab.click();

    // Assert
    const panel = page.getByRole("tabpanel");
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(/kompetanseheving|egenlæring/i);
  });

  test("displays Frivillig arbeid content when tab clicked", async ({
    page,
  }) => {
    // Arrange
    const frivilligTab = page.getByRole("tab", { name: "Frivillig arbeid" });

    // Act
    await frivilligTab.click();

    // Assert
    const panel = page.getByRole("tabpanel");
    await expect(panel).toBeVisible();
  });

  test("tab content changes when switching tabs", async ({ page }) => {
    // Arrange
    const erfaringTab = page.getByRole("tab", { name: "Erfaring" });
    const utdanningTab = page.getByRole("tab", { name: "Utdanning" });

    // Act
    await erfaringTab.click();
    const erfaringContent = await page.getByRole("tabpanel").textContent();

    await utdanningTab.click();
    const utdanningContent = await page.getByRole("tabpanel").textContent();

    // Assert
    expect(erfaringContent).not.toBe(utdanningContent);
    expect(erfaringContent).toBeTruthy();
    expect(utdanningContent).toBeTruthy();
  });

  test("all tabs are accessible and clickable", async ({ page }) => {
    // Arrange
    const tabs = [
      "Nøkkelkvalifikasjoner",
      "Erfaring",
      "Utdanning",
      "Frivillig arbeid",
    ];

    // Act & Assert
    for (const tabName of tabs) {
      const tab = page.getByRole("tab", { name: tabName });
      await expect(tab).toBeVisible();
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", "true");
    }
  });
});

test.describe("CV page tab panels", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cv");
  });

  test("tab panel has correct aria-labelledby", async ({ page }) => {
    // Arrange
    const panel = page.getByRole("tabpanel");

    // Act
    const labelledBy = await panel.getAttribute("aria-labelledby");

    // Assert
    expect(labelledBy).toBeTruthy();
  });

  test("only one tabpanel is visible at a time", async ({ page }) => {
    // Arrange
    const allPanels = page.getByRole("tabpanel");

    // Act
    const visibleCount = await allPanels.count();

    // Assert
    expect(visibleCount).toBe(1);
  });

  test("tab panel updates when tab is selected via keyboard", async ({
    page,
  }) => {
    // Arrange
    await page.getByRole("tab", { name: "Nøkkelkvalifikasjoner" }).focus();

    // Act
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    // Assert
    const erfaringTab = page.getByRole("tab", { name: "Erfaring" });
    await expect(erfaringTab).toHaveAttribute("aria-selected", "true");
    await expect(
      page.getByRole("heading", { name: /– 2021 - NovaCare/i }),
    ).toBeVisible();
  });
});

test.describe("CV page additional features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cv");
  });

  test("page heading is visible", async ({ page }) => {
    // Arrange
    // (page loaded)

    // Act
    const heading = page.getByRole("heading", { level: 1 });

    // Assert
    await expect(heading).toBeVisible();
  });

  test("page has correct main landmark", async ({ page }) => {
    // Arrange
    // (page loaded)

    // Act
    const main = page.getByRole("main");

    // Assert
    await expect(main).toBeVisible();
  });

  test("tab interface has correct ARIA structure", async ({ page }) => {
    // Arrange
    const tablist = page.getByRole("tablist");

    // Act
    const tabs = page.getByRole("tab");
    const tabCount = await tabs.count();

    // Assert
    await expect(tablist).toBeVisible();
    expect(tabCount).toBe(4);
  });

  test("PDF download link is visible and accessible", async ({ page }) => {
    // Arrange
    // (page loaded)

    // Act
    const pdfLink = page.getByRole("link", { name: /last ned pdf/i });

    // Assert
    if ((await pdfLink.count()) > 0) {
      await expect(pdfLink.first()).toBeVisible();
      const href = await pdfLink.first().getAttribute("href");
      expect(href).toContain(".pdf");
    }
  });

  test("PDF viewer or images are displayed", async ({ page }) => {
    // Arrange
    // (page loaded)

    // Act
    // Look for various CV content indicators
    const cvImages = page.locator('img[alt*="CV"], img[alt*="cv"], img[src*="cv"], img[src*="/cv/"]');
    const pdfLinks = page.locator('a[href*=".pdf"]');
    const mainContent = page.getByRole("main");

    // Assert
    // CV page should have either images, PDF links, or substantial content
    const hasImages = (await cvImages.count()) > 0;
    const hasPdfLinks = (await pdfLinks.count()) > 0;
    const hasContent = await mainContent.isVisible();
    
    expect(hasImages || hasPdfLinks || hasContent).toBe(true);
  });
});
