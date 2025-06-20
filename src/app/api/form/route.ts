import { NextRequest, NextResponse } from "next/server";
import { validateCSRFToken } from "@/lib/csrf";

/**
 * POST handler for form submissions with CSRF protection
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

    // Remove CSRF token from form data before processing
    delete formData._csrf;
    delete formData.csrfToken;

    // Validate required fields
    const { navn, telefon, tekst } = formData;

    if (!navn || !telefon || !tekst) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Basic validation
    if (navn.length < 2 || navn.length > 100) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters" },
        { status: 400 },
      );
    }

    if (tekst.length < 10 || tekst.length > 1000) {
      return NextResponse.json(
        { error: "Message must be between 10 and 1000 characters" },
        { status: 400 },
      );
    }

    // Log the form submission (in production, you might want to save to database)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwardedFor?.split(",")[0] ?? realIp ?? "unknown";

    console.log("Form submission received:", {
      navn,
      telefon,
      tekst,
      timestamp: new Date().toISOString(),
      ip: clientIp,
    });

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
