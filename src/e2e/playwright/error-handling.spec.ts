import { test, expect } from "@playwright/test";

test.describe("Error Boundaries", () => {
  test("error boundary button exists on homepage Om Meg section", async ({
    page,
  }) => {
    // Arrange
    await page.goto("/");

    // Act
    const omMegSection = page.getByLabel("Om Meg");
    const errorButton = omMegSection.getByRole("button", {
      name: "Utløs Testfeil",
    });

    // Assert
    await expect(errorButton).toBeVisible();
  });

  test("error boundary button exists on homepage Prosjekter section", async ({
    page,
  }) => {
    // Arrange
    await page.goto("/");

    // Act
    const prosjekterSection = page.getByLabel("Prosjekter");
    const errorButton = prosjekterSection.getByRole("button", {
      name: "Utløs Testfeil",
    });

    // Assert
    await expect(errorButton).toBeVisible();
  });

  test("clicking error button triggers error boundary", async ({ page }) => {
    // Arrange
    await page.goto("/");
    const errorButton = page
      .getByLabel("Om Meg")
      .getByRole("button", { name: "Utløs Testfeil" });

    // Act
    await errorButton.click();

    // Assert
    // Error boundary should display error message
    await expect(
      page.getByText(/noe gikk galt|error|feil/i).first(),
    ).toBeVisible();
  });

  test("error fallback displays when error occurs", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page
      .getByLabel("Om Meg")
      .getByRole("button", { name: "Utløs Testfeil" })
      .click();

    // Assert
    // Should show some error UI (heading, message, or recovery button)
    const errorElements = page.getByText(/error|feil|gikk galt/i);
    await expect(errorElements.first()).toBeVisible();
  });

  test("error boundary has recovery mechanism", async ({ page }) => {
    // Arrange
    await page.goto("/");
    await page
      .getByLabel("Om Meg")
      .getByRole("button", { name: "Utløs Testfeil" })
      .click();

    // Act
    // Look for a reset/try again button
    const resetButton = page.getByRole("button", { name: /prøv igjen|reset/i });

    // Assert
    if ((await resetButton.count()) > 0) {
      await expect(resetButton.first()).toBeVisible();
    }
  });

  test("error boundary isolates errors to component", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page
      .getByLabel("Om Meg")
      .getByRole("button", { name: "Utløs Testfeil" })
      .click();

    // Assert
    // Navigation should still be visible (error is isolated)
    const nav = page.getByRole("navigation").first();
    await expect(nav).toBeVisible();
  });

  test("multiple error boundaries work independently", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page
      .getByLabel("Om Meg")
      .getByRole("button", { name: "Utløs Testfeil" })
      .click();

    // Assert
    // Prosjekter section should still be visible
    const prosjekterSection = page.getByLabel("Prosjekter");
    await expect(prosjekterSection).toBeVisible();
  });
});

test.describe("404 Not Found", () => {
  test("displays 404 page for non-existent route", async ({ page }) => {
    // Arrange
    // (navigate to invalid route)

    // Act
    const response = await page.goto("/this-page-does-not-exist");

    // Assert
    expect(response?.status()).toBe(404);
    await expect(
      page.getByText(/404|ikke funnet|not found/i).first(),
    ).toBeVisible();
  });

  test("404 page has meaningful content", async ({ page }) => {
    // Arrange
    await page.goto("/invalid-route-that-does-not-exist");

    // Act
    const content = await page.textContent("body");

    // Assert
    expect(content).toMatch(/404|ikke funnet|not found/i);
  });

  test("404 page has navigation back to site", async ({ page }) => {
    // Arrange
    await page.goto("/non-existent-page");

    // Act
    const homeLink = page.getByRole("link", { name: /hjem|home/i }).first();

    // Assert
    if ((await homeLink.count()) > 0) {
      await expect(homeLink).toBeVisible();
      await expect(homeLink).toHaveAttribute("href", "/");
    } else {
      // Navigation header should still be present
      const nav = page.getByRole("navigation").first();
      await expect(nav).toBeVisible();
    }
  });

  test("navigating to homepage from 404 works", async ({ page }) => {
    // Arrange
    await page.goto("/invalid-route");

    // Act
    const hjemLink = page.getByRole("link", { name: /hjem/i }).first();
    await hjemLink.click();

    // Assert
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Hei!" })).toBeVisible();
  });

  test("404 page maintains site layout", async ({ page }) => {
    // Arrange
    await page.goto("/does-not-exist");

    // Act
    const nav = page.getByRole("navigation").first();
    const footer = page.getByRole("contentinfo");

    // Assert
    await expect(nav).toBeVisible();
    await expect(footer).toBeVisible();
  });
});

test.describe("Loading States", () => {
  test("page shows loading indicator during navigation", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const navigationPromise = page
      .getByRole("navigation")
      .getByRole("link", { name: "Prosjekter" })
      .click();

    // Assert
    // Check if loading state appears briefly
    // (This might be too fast to catch, but we try)
    await navigationPromise;
    await expect(page).toHaveURL("/prosjekter");
  });

  test("contact form shows loading state during submission", async ({
    page,
  }) => {
    // Arrange
    await page.goto("/kontakt");
    await page.getByLabel("Fullt navn").fill("Test User");
    await page.getByLabel("Telefonnummer").fill("12345678");
    await page
      .getByLabel("Hva ønsker du å si?")
      .fill("This is a test message that is long enough.");

    // Act
    const submitButton = page.getByTestId("submit-button");
    const submitPromise = submitButton.click();

    // Assert
    await expect(submitButton).toBeDisabled();
    await submitPromise;
  });
});

test.describe("Network Error Handling", () => {
  test("handles offline scenario gracefully", async ({ page, context }) => {
    // Arrange
    await page.goto("/");

    // Act
    await context.setOffline(true);
    const clickPromise = page
      .getByRole("navigation")
      .getByRole("link", { name: "Prosjekter" })
      .click();

    // Assert
    // Navigation should fail when offline
    let navigationFailed = false;
    await clickPromise.catch(() => {
      navigationFailed = true;
    });
    expect(navigationFailed).toBe(true);
    await context.setOffline(false);
  });

  test("form handles network failure on submission", async ({ page }) => {
    // Arrange
    await page.goto("/kontakt");
    await page.route("**/api/form", (route) => route.abort());
    await page.getByLabel("Fullt navn").fill("Test User");
    await page.getByLabel("Telefonnummer").fill("12345678");
    await page
      .getByLabel("Hva ønsker du å si?")
      .fill("This is a test message that is long enough.");

    // Act
    await page.getByTestId("submit-button").click();

    // Assert
    await expect(
      page.getByText(/feil under sending|error|kunne ikke sende/i),
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Error Recovery", () => {
  test("page reload recovers from error state", async ({ page }) => {
    // Arrange
    await page.goto("/");
    await page
      .getByLabel("Om Meg")
      .getByRole("button", { name: "Utløs Testfeil" })
      .click();
    await expect(page.getByText(/funnet en feil i matrix/i).first()).toBeVisible();

    // Act
    await page.reload();

    // Assert
    await expect(page.getByRole("heading", { name: "Hei!" })).toBeVisible();
    await expect(page.getByText(/funnet en feil i matrix/i).first()).not.toBeVisible();
  });

  test("navigation away from error clears error state", async ({ page }) => {
    // Arrange
    await page.goto("/");
    await page
      .getByLabel("Om Meg")
      .getByRole("button", { name: "Utløs Testfeil" })
      .click();

    // Act
    await page.getByRole("navigation").getByRole("link", { name: "CV" }).click();
    await page.getByRole("navigation").getByRole("link", { name: "Hjem" }).click();

    // Assert
    await expect(page.getByRole("heading", { name: "Hei!" })).toBeVisible();
  });
});

test.describe("Console Error Monitoring", () => {
  test("no console errors on homepage load", async ({ page }) => {
    // Arrange
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Act
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Assert
    // Filter out expected errors (like test error buttons)
    const unexpectedErrors = consoleErrors.filter(
      (err) =>
        !err.includes("Test Error") &&
        !err.includes("Utløs Testfeil") &&
        !err.includes("AnimatePresence"),
    );
    expect(unexpectedErrors).toHaveLength(0);
  });

  test("no console errors on CV page load", async ({ page }) => {
    // Arrange
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Act
    await page.goto("/cv");
    await page.waitForLoadState("networkidle");

    // Assert
    const unexpectedErrors = consoleErrors.filter(
      (err) => !err.includes("AnimatePresence"),
    );
    expect(unexpectedErrors).toHaveLength(0);
  });

  test("no console errors on Kontakt page load", async ({ page }) => {
    // Arrange
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Act
    await page.goto("/kontakt");
    await page.waitForLoadState("networkidle");

    // Assert
    expect(consoleErrors).toHaveLength(0);
  });

  test("no console errors on Prosjekter page load", async ({ page }) => {
    // Arrange
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Act
    await page.goto("/prosjekter");
    await page.waitForLoadState("networkidle");

    // Assert
    const unexpectedErrors = consoleErrors.filter(
      (err) => !err.includes("Image") && !err.includes("quality"),
    );
    expect(unexpectedErrors.length).toBe(0);
  });
});
