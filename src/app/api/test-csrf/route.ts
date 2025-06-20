import { NextResponse } from "next/server";

/**
 * Test endpoint to demonstrate CSRF protection
 * This will attempt to submit to /api/form without a CSRF token
 */
export async function GET() {
  try {
    // Attempt to submit form data without CSRF token
    const testData = {
      navn: "Test User",
      telefon: "12345678",
      tekst: "This is a test submission without CSRF token",
    };

    const response = await fetch(
      `${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/form`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      },
    );

    const result = await response.json();

    return NextResponse.json({
      message: "CSRF Protection Test Results",
      testWithoutToken: {
        status: response.status,
        response: result,
        expected: "Should be blocked with 403 status",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
