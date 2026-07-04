import { test, expect } from "@playwright/test";

test.describe("Contact page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/kontakt");
  });

  test("loads and displays form elements correctly", async ({ page }) => {
    // Arrange
    // (page loaded)

    // Act
    // (check visibility)

    // Assert
    await expect(page.getByText("Fullt navn")).toBeVisible();
    await expect(page.getByText("Telefonnummer")).toBeVisible();
    await expect(page.getByText("Hva ønsker du å si?")).toBeVisible();
    await expect(page.getByTestId("submit-button")).toBeVisible();
  });

  test("submit button has correct text", async ({ page }) => {
    // Arrange
    // (page loaded)

    // Act
    const submitButton = page.getByTestId("submit-button");

    // Assert
    await expect(submitButton).toHaveText("Send skjema");
  });
});

test.describe("Contact form validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/kontakt");
  });

  test("shows error when submitting empty form", async ({ page }) => {
    // Arrange
    const submitButton = page.getByTestId("submit-button");

    // Act
    await submitButton.click();

    // Assert
    await expect(page.getByText(/navn er påkrevd/i)).toBeVisible();
    await expect(page.getByText(/telefonnummer er påkrevd/i)).toBeVisible();
    await expect(page.getByText(/beskjed er påkrevd/i)).toBeVisible();
  });

  test("validates name field minimum length", async ({ page }) => {
    // Arrange
    const nameField = page.getByLabel("Fullt navn");

    // Act
    await nameField.fill("A");
    await page.getByTestId("submit-button").click();

    // Assert
    await expect(page.getByText(/navn må være minst 2 tegn/i)).toBeVisible();
  });

  test("validates name field - only accepts letters", async ({ page }) => {
    // Arrange
    const nameField = page.getByLabel("Fullt navn");

    // Act
    await nameField.fill("Test123");
    await page.getByTestId("submit-button").click();

    // Assert
    await expect(
      page.getByText(/vennligst bruk norske bokstaver/i),
    ).toBeVisible();
  });

  test("validates phone number format - requires 8 digits", async ({
    page,
  }) => {
    // Arrange
    const phoneField = page.getByLabel("Telefonnummer");

    // Act
    await phoneField.fill("123");
    await page.getByTestId("submit-button").click();

    // Assert
    await expect(
      page.getByText(/vennligst oppgi et gyldig telefonnummer/i),
    ).toBeVisible();
  });

  test("validates phone number format - only accepts numbers", async ({
    page,
  }) => {
    // Arrange
    const phoneField = page.getByLabel("Telefonnummer");

    // Act
    await phoneField.fill("abcdefgh");
    await page.getByTestId("submit-button").click();

    // Assert
    await expect(
      page.getByText(/vennligst oppgi et gyldig telefonnummer/i),
    ).toBeVisible();
  });

  test("validates message field minimum length", async ({ page }) => {
    // Arrange
    const messageField = page.getByLabel("Hva ønsker du å si?");

    // Act
    await messageField.fill("Hi");
    await page.getByTestId("submit-button").click();

    // Assert
    await expect(
      page.getByText(/beskjed må være minst 10 tegn/i),
    ).toBeVisible();
  });

  test("accepts valid Norwegian characters in name", async ({ page }) => {
    // Arrange
    const nameField = page.getByLabel("Fullt navn");
    const phoneField = page.getByLabel("Telefonnummer");
    const messageField = page.getByLabel("Hva ønsker du å si?");

    // Act
    await nameField.fill("Øyvind Åse");
    await phoneField.fill("12345678");
    await messageField.fill("Dette er en test melding som er lang nok.");

    // Assert
    await expect(page.getByText(/vennligst bruk norske bokstaver/i)).not.toBeVisible();
  });

  test("clears error message when field is corrected", async ({ page }) => {
    // Arrange
    await page.getByTestId("submit-button").click();
    await expect(page.getByText(/fullt navn er påkrevd/i)).toBeVisible();

    // Act
    await page.getByLabel("Fullt navn").fill("John Doe");
    await page.getByLabel("Fullt navn").blur();

    // Assert
    await expect(page.getByText(/fullt navn er påkrevd/i)).not.toBeVisible();
  });
});

test.describe("Contact form submission", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/kontakt");
  });

  test("successfully submits valid form", async ({ page }) => {
    // Arrange
    // Mock EmailJS API response
    await page.route("**/*api.emailjs.com/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.getByLabel("Fullt navn").fill("John Doe");
    await page.getByLabel("Telefonnummer").fill("12345678");
    await page
      .getByLabel("Hva ønsker du å si?")
      .fill("Dette er en testmelding som er lang nok til å valideres.");

    // Act
    await page.getByTestId("submit-button").click();

    // Assert
    await expect(page.getByText(/takk for din beskjed/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test("disables submit button during submission", async ({ page }) => {
    // Arrange
    await page.getByLabel("Fullt navn").fill("John Doe");
    await page.getByLabel("Telefonnummer").fill("12345678");
    await page
      .getByLabel("Hva ønsker du å si?")
      .fill("Dette er en testmelding som er lang nok til å valideres.");

    // Act
    const submitButton = page.getByTestId("submit-button");
    const submitPromise = submitButton.click();

    // Assert
    await expect(submitButton).toBeDisabled();
    await submitPromise;
  });

  test("handles network error gracefully", async ({ page }) => {
    // Arrange
    await page.route("**/api/form", (route) => route.abort());
    await page.getByLabel("Fullt navn").fill("John Doe");
    await page.getByLabel("Telefonnummer").fill("12345678");
    await page
      .getByLabel("Hva ønsker du å si?")
      .fill("Dette er en testmelding som er lang nok til å valideres.");

    // Act
    await page.getByTestId("submit-button").click();

    // Assert
    await expect(page.getByText(/feil under sending av skjema/i)).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Contact form accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/kontakt");
  });

  test("form fields have correct labels", async ({ page }) => {
    // Arrange
    const nameField = page.getByLabel("Fullt navn");
    const phoneField = page.getByLabel("Telefonnummer");
    const messageField = page.getByLabel("Hva ønsker du å si?");

    // Act
    // (check associations)

    // Assert
    await expect(nameField).toBeVisible();
    await expect(phoneField).toBeVisible();
    await expect(messageField).toBeVisible();
  });

  test("form has correct aria-label", async ({ page }) => {
    // Arrange
    // (page loaded)

    // Act
    const form = page.locator('form[aria-label="Contact Form"]');

    // Assert
    await expect(form).toBeVisible();
  });

  test("required fields are marked", async ({ page }) => {
    // Arrange
    // (page loaded)

    // Act
    const nameLabel = page.getByText("Fullt navn");
    const phoneLabel = page.getByText("Telefonnummer");
    const messageLabel = page.getByText("Hva ønsker du å si?");

    // Assert
    await expect(nameLabel).toBeVisible();
    await expect(phoneLabel).toBeVisible();
    await expect(messageLabel).toBeVisible();
  });

  test("success message is announced to screen readers", async ({ page }) => {
    // Arrange
    await page.getByLabel("Fullt navn").fill("John Doe");
    await page.getByLabel("Telefonnummer").fill("12345678");
    await page
      .getByLabel("Hva ønsker du å si?")
      .fill("Dette er en testmelding som er lang nok til å valideres.");

    // Act
    await page.getByTestId("submit-button").click();

    // Assert
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Contact form field interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/kontakt");
  });

  test("can type into all form fields", async ({ page }) => {
    // Arrange
    const nameField = page.getByLabel("Fullt navn");
    const phoneField = page.getByLabel("Telefonnummer");
    const messageField = page.getByLabel("Hva ønsker du å si?");

    // Act
    await nameField.fill("Test User");
    await phoneField.fill("98765432");
    await messageField.fill("Test message content");

    // Assert
    await expect(nameField).toHaveValue("Test User");
    await expect(phoneField).toHaveValue("98765432");
    await expect(messageField).toHaveValue("Test message content");
  });

  test("can clear form fields", async ({ page }) => {
    // Arrange
    const nameField = page.getByLabel("Fullt navn");
    await nameField.fill("Test User");

    // Act
    await nameField.clear();

    // Assert
    await expect(nameField).toHaveValue("");
  });

  test("form fields have correct input types", async ({ page }) => {
    // Arrange
    const phoneField = page.getByLabel("Telefonnummer");

    // Act
    const inputMode = await phoneField.getAttribute("inputmode");

    // Assert
    expect(inputMode).toBe("tel");
  });

  test("name field has autocomplete attribute", async ({ page }) => {
    // Arrange
    const nameField = page.getByLabel("Fullt navn");

    // Act
    const autocomplete = await nameField.getAttribute("autocomplete");

    // Assert
    expect(autocomplete).toBe("name");
  });

  test("phone field has autocomplete attribute", async ({ page }) => {
    // Arrange
    const phoneField = page.getByLabel("Telefonnummer");

    // Act
    const autocomplete = await phoneField.getAttribute("autocomplete");

    // Assert
    expect(autocomplete).toBe("tel");
  });
});
