import { NextRequest, NextResponse } from "next/server";
import { validateCSRFToken } from "@/lib/csrf";
import { formSchema } from "@/components/Kontakt/config/formConfig";

/**
 * Parse the request body based on content type.
 * Returns the parsed form data or a NextResponse error.
 */
async function parseRequestBody(
  request: NextRequest,
): Promise<Record<string, string> | NextResponse> {
  const contentType = request.headers.get("content-type");

  if (contentType?.includes("application/x-www-form-urlencoded")) {
    const body = await request.formData();
    const formData: Record<string, string> = {};
    for (const [key, value] of body.entries()) {
      formData[key] = value.toString();
    }
    return formData;
  }

  if (contentType?.includes("application/json")) {
    return await request.json();
  }

  return NextResponse.json(
    { error: "Unsupported content type" },
    { status: 400 },
  );
}

/**
 * Validate the CSRF token from form data.
 * Returns a NextResponse error if invalid, or null if valid.
 */
function validateCsrf(formData: Record<string, string>): NextResponse | null {
  const csrfToken = formData._csrf || formData.csrfToken;

  if (!csrfToken) {
    return NextResponse.json(
      { error: "CSRF token missing" },
      { status: 403 },
    );
  }

  if (!validateCSRFToken(csrfToken)) {
    return NextResponse.json(
      { error: "Invalid or expired CSRF token" },
      { status: 403 },
    );
  }

  return null;
}

/**
 * POST handler for form submissions with CSRF protection.
 * Uses the shared Zod schema from formConfig.ts as the single source
 * of truth for validation — same rules on client and server.
 * @param {NextRequest} request - The incoming request
 * @returns {NextResponse} JSON response
 */
export async function POST(request: NextRequest) {
  try {
    const parsed = await parseRequestBody(request);

    if (parsed instanceof NextResponse) {
      return parsed;
    }

    const formData = parsed;
    const csrfError = validateCsrf(formData);
    if (csrfError) return csrfError;

    // Remove CSRF token from form data before validation
    delete formData._csrf;
    delete formData.csrfToken;

    // Validate using the shared Zod schema — single source of truth
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Validation failed" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Form submitted successfully", success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing form submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Handle other HTTP methods
 */
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
