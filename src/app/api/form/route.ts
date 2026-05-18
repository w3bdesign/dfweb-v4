import { NextRequest, NextResponse } from "next/server";
import { validateCSRFToken } from "@/lib/csrf";
import { formSchema } from "@/components/Kontakt/config/formConfig";

/**
 * POST handler for form submissions with CSRF protection.
 * Uses the shared Zod schema from formConfig.ts as the single source
 * of truth for validation — same rules on client and server.
 * @param {NextRequest} request - The incoming request
 * @returns {NextResponse} JSON response
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    let formData: Record<string, string> = {};

    // Parse form data based on content type
    if (contentType?.includes("application/x-www-form-urlencoded")) {
      const body = await request.formData();
      for (const [key, value] of body.entries()) {
        formData[key] = value.toString();
      }
    } else if (contentType?.includes("application/json")) {
      formData = await request.json();
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 },
      );
    }

    // Extract and validate CSRF token
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

    // Return success response
    return NextResponse.json(
      {
        message: "Form submitted successfully",
        success: true,
      },
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
