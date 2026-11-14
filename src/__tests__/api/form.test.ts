/**
 * @jest-environment node
 */
import { randomBytes } from "node:crypto";
import { NextRequest } from "next/server";
import { DELETE, GET, POST, PUT } from "@/app/api/form/route";
import { GET as getCsrfToken } from "@/app/api/csrf-token/route";
import { generateCSRFToken } from "@/lib/csrf";

const FORM_URL = "http://localhost:3000/api/form";
const ONE_HOUR = 60 * 60 * 1000;

const VALID_FORM = {
  navn: "Ola Nordmann",
  telefon: "12345678",
  tekst: "Hei, dette er en testmelding.",
};

const jsonRequest = (body: unknown) =>
  new NextRequest(FORM_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const urlencodedRequest = (body: Record<string, string>) =>
  new NextRequest(FORM_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });

describe("POST /api/form", () => {
  const originalSecret = process.env.CSRF_SECRET;

  beforeEach(() => {
    process.env.CSRF_SECRET = randomBytes(16).toString("hex");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalSecret === undefined) {
      delete process.env.CSRF_SECRET;
    } else {
      process.env.CSRF_SECRET = originalSecret;
    }
  });

  it("returns 200 for valid JSON with a valid csrfToken", async () => {
    // Arrange
    const request = jsonRequest({
      ...VALID_FORM,
      csrfToken: generateCSRFToken(),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual({
      message: "Form submitted successfully",
      success: true,
    });
  });

  it("returns 200 for valid urlencoded data with a valid _csrf field", async () => {
    // Arrange
    const request = urlencodedRequest({
      ...VALID_FORM,
      _csrf: generateCSRFToken(),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(200);
    expect((await response.json()).success).toBe(true);
  });

  it("accepts Norwegian letters in the name", async () => {
    // Arrange
    const request = jsonRequest({
      ...VALID_FORM,
      navn: "Ærlige Øystein Ås",
      csrfToken: generateCSRFToken(),
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(200);
  });

  const unsupportedTypes = ["text/plain", "multipart/form-data; boundary=x"];

  unsupportedTypes.forEach((contentType) => {
    it(`returns 400 for unsupported content type ${contentType}`, async () => {
      // Arrange
      const request = new NextRequest(FORM_URL, {
        method: "POST",
        headers: { "content-type": contentType },
        body: "navn=Ola",
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(400);
      expect(await response.json()).toStrictEqual({
        error: "Unsupported content type",
      });
    });
  });

  it("returns 400 when the content type header is missing", async () => {
    // Arrange
    const request = new NextRequest(FORM_URL, { method: "POST" });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(400);
  });

  it("returns 403 when the CSRF token is missing", async () => {
    // Arrange
    const request = jsonRequest(VALID_FORM);

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(403);
    expect(await response.json()).toStrictEqual({
      error: "CSRF token missing",
    });
  });

  it("returns 403 for an invalid CSRF token", async () => {
    // Arrange
    const request = jsonRequest({ ...VALID_FORM, csrfToken: "forged" });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(403);
    expect(await response.json()).toStrictEqual({
      error: "Invalid or expired CSRF token",
    });
  });

  it("returns 403 for an expired CSRF token", async () => {
    // Arrange
    const issuedAt = 1_700_000_000_000;
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(issuedAt);
    const token = generateCSRFToken();
    nowSpy.mockReturnValue(issuedAt + ONE_HOUR + 1);
    const request = jsonRequest({ ...VALID_FORM, csrfToken: token });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(403);
    expect(await response.json()).toStrictEqual({
      error: "Invalid or expired CSRF token",
    });
  });

  const invalidForms: Array<{
    label: string;
    form: Record<string, string>;
    message: string;
  }> = [
    {
      label: "empty name",
      form: { ...VALID_FORM, navn: "" },
      message: "Fullt navn er påkrevd",
    },
    {
      label: "name with digits",
      form: { ...VALID_FORM, navn: "Ola123" },
      message: "Vennligst bruk norske bokstaver",
    },
    {
      label: "empty phone",
      form: { ...VALID_FORM, telefon: "" },
      message: "Telefonnummer er påkrevd",
    },
    {
      label: "7 digit phone",
      form: { ...VALID_FORM, telefon: "1234567" },
      message: "Vennligst oppgi et gyldig telefonnummer",
    },
    {
      label: "empty message",
      form: { ...VALID_FORM, tekst: "" },
      message: "Beskjed er påkrevd",
    },
  ];

  invalidForms.forEach(({ label, form, message }) => {
    it(`returns 400 with the first Zod issue for ${label}`, async () => {
      // Arrange
      const request = jsonRequest({ ...form, csrfToken: generateCSRFToken() });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(400);
      expect(await response.json()).toStrictEqual({ error: message });
    });
  });

  it("returns 500 when the body cannot be parsed", async () => {
    // Arrange
    vi.spyOn(console, "error").mockImplementation(() => {});
    const request = new NextRequest(FORM_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not json",
    });

    // Act
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(500);
    expect(await response.json()).toStrictEqual({
      error: "Internal server error",
    });
  });

  it("accepts a token issued by /api/csrf-token (contract test)", async () => {
    // Arrange
    const tokenResponse = await getCsrfToken();
    const { csrfToken } = await tokenResponse.json();

    // Act
    const response = await POST(jsonRequest({ ...VALID_FORM, csrfToken }));

    // Assert
    expect(tokenResponse.status).toBe(200);
    expect(response.status).toBe(200);
  });
});

describe("Other methods on /api/form", () => {
  const handlers = [
    { method: "GET", handler: GET },
    { method: "PUT", handler: PUT },
    { method: "DELETE", handler: DELETE },
  ];

  handlers.forEach(({ method, handler }) => {
    it(`${method} returns 405`, async () => {
      // Arrange
      const call = handler;

      // Act
      const response = await call();

      // Assert
      expect(response.status).toBe(405);
      expect(await response.json()).toStrictEqual({
        error: "Method not allowed",
      });
    });
  });
});
