import { test, expect, type Page, type Route } from "@playwright/test";

/**
 * Contact form user journeys.
 * EmailJS is a third-party API, so every test intercepts it with page.route
 * and no real email is sent.
 */

const EMAILJS_ROUTE = "**/api.emailjs.com/**";

const SUCCESS_MESSAGE = "Takk for din beskjed";
const ERROR_MESSAGE = "Feil under sending av skjema";

const REQUIRED_ERRORS = [
  "Fullt navn er påkrevd",
  "Telefonnummer er påkrevd",
  "Beskjed er påkrevd",
];

const VALID_INPUT = {
  navn: "Ola Nordmann",
  telefon: "12345678",
  tekst: "Hei! Dette er en testmelding fra Playwright.",
};

async function fillForm(
  page: Page,
  values: Partial<typeof VALID_INPUT> = VALID_INPUT,
) {
  if (values.navn !== undefined) await page.locator("#navn").fill(values.navn);
  if (values.telefon !== undefined)
    await page.locator("#telefon").fill(values.telefon);
  if (values.tekst !== undefined)
    await page.locator("#tekst").fill(values.tekst);
}

/** Counts EmailJS requests and answers them with the given handler. */
async function mockEmailJs(
  page: Page,
  handler: (route: Route) => Promise<void>,
) {
  const calls = { count: 0 };
  await page.route(EMAILJS_ROUTE, async (route) => {
    calls.count += 1;
    await handler(route);
  });
  return calls;
}

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/kontakt");
    await expect(page.getByTestId("submit-button")).toBeVisible();
  });

  test("shows the success message when EmailJS returns 200", async ({
    page,
  }) => {
    const calls = await mockEmailJs(page, (route) =>
      route.fulfill({ status: 200, contentType: "text/plain", body: "OK" }),
    );

    await fillForm(page);
    await page.getByTestId("submit-button").click();

    await expect(page.getByText(SUCCESS_MESSAGE)).toBeVisible();
    expect(calls.count).toBe(1);
  });

  test("sends the form values to EmailJS", async ({ page }) => {
    await mockEmailJs(page, (route) =>
      route.fulfill({ status: 200, contentType: "text/plain", body: "OK" }),
    );

    await fillForm(page);
    const [request] = await Promise.all([
      page.waitForRequest(EMAILJS_ROUTE),
      page.getByTestId("submit-button").click(),
    ]);

    const payload = request.postDataJSON();
    expect(payload.template_params).toMatchObject(VALID_INPUT);
  });

  test("shows the error message when EmailJS returns 500", async ({ page }) => {
    await mockEmailJs(page, (route) =>
      route.fulfill({
        status: 500,
        contentType: "text/plain",
        body: "Server error",
      }),
    );

    await fillForm(page);
    await page.getByTestId("submit-button").click();

    await expect(page.getByText(ERROR_MESSAGE)).toBeVisible();
    await expect(page.getByText(SUCCESS_MESSAGE)).toHaveCount(0);
  });

  test("shows the error message when the network request fails", async ({
    page,
  }) => {
    await mockEmailJs(page, (route) => route.abort("failed"));

    await fillForm(page);
    await page.getByTestId("submit-button").click();

    await expect(page.getByText(ERROR_MESSAGE)).toBeVisible();
  });

  test("shows all required-field errors on empty submit and sends nothing", async ({
    page,
  }) => {
    const calls = await mockEmailJs(page, (route) =>
      route.fulfill({ status: 200, body: "OK" }),
    );

    await page.getByTestId("submit-button").click();

    for (const message of REQUIRED_ERRORS) {
      await expect(page.getByText(message)).toBeVisible();
    }
    expect(calls.count).toBe(0);
  });

  test("shows format errors for an invalid name and phone", async ({
    page,
  }) => {
    const calls = await mockEmailJs(page, (route) =>
      route.fulfill({ status: 200, body: "OK" }),
    );

    await fillForm(page, {
      navn: "Ola123",
      telefon: "12ab5678",
      tekst: VALID_INPUT.tekst,
    });
    await page.getByTestId("submit-button").click();

    await expect(page.getByText("Vennligst bruk norske bokstaver")).toHaveCount(
      // The input title attribute is not rendered text, so only the error matches
      1,
    );
    await expect(
      page.getByText("Vennligst oppgi et gyldig telefonnummer"),
    ).toBeVisible();
    expect(calls.count).toBe(0);
  });

  test("accepts Norwegian letters æøå in the name", async ({ page }) => {
    await mockEmailJs(page, (route) =>
      route.fulfill({ status: 200, contentType: "text/plain", body: "OK" }),
    );

    await fillForm(page, { ...VALID_INPUT, navn: "Kåre Ærlig Østby" });
    await page.getByTestId("submit-button").click();

    await expect(page.getByText(SUCCESS_MESSAGE)).toBeVisible();
  });

  for (const telefon of ["1234567", "123456789"]) {
    test(`rejects a phone number with ${telefon.length} digits`, async ({
      page,
    }) => {
      const calls = await mockEmailJs(page, (route) =>
        route.fulfill({ status: 200, body: "OK" }),
      );

      await fillForm(page, { ...VALID_INPUT, telefon });
      await page.getByTestId("submit-button").click();

      await expect(
        page.getByText("Vennligst oppgi et gyldig telefonnummer"),
      ).toBeVisible();
      expect(calls.count).toBe(0);
    });
  }

  test("disables the submit button while the request is in flight", async ({
    page,
  }) => {
    let release: () => void = () => {};
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await mockEmailJs(page, async (route) => {
      await held;
      await route.fulfill({
        status: 200,
        contentType: "text/plain",
        body: "OK",
      });
    });
    const submit = page.getByTestId("submit-button");

    await fillForm(page);
    const requestStarted = page.waitForRequest(EMAILJS_ROUTE);
    await submit.click();
    await requestStarted;

    await expect(submit).toBeDisabled();
    await expect(submit).toHaveAttribute("aria-busy", "true");
    await expect(submit).toContainText("Send skjema");

    release();
    await expect(page.getByText(SUCCESS_MESSAGE)).toBeVisible();
  });
});
