import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

/**
 * API route for on-demand revalidation of cached data.
 * Call this from Sanity webhooks to invalidate cache immediately when content changes.
 *
 * Usage:
 * POST /api/revalidate?secret=YOUR_SECRET&tag=projects&immediate=true
 *
 * Set up Sanity webhook to POST to:
 * https://yoursite.com/api/revalidate?secret=YOUR_SECRET&tag=projects&immediate=true
 *
 * Query parameters:
 * - secret: Required. Matches REVALIDATE_SECRET environment variable
 * - tag: Required. Cache tag to invalidate (e.g., 'projects')
 * - immediate: Optional. If 'true', expires immediately. Otherwise uses stale-while-revalidate
 */

/**
 * Constant-time string comparison to prevent timing attacks
 */
function secureCompare(a: string | null, b: string | undefined): boolean {
  if (!a || !b || a.length !== b.length) {
    return false;
  }

  try {
    const bufferA = Buffer.from(a, "utf-8");
    const bufferB = Buffer.from(b, "utf-8");
    return timingSafeEqual(bufferA, bufferB);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");
  const immediate = request.nextUrl.searchParams.get("immediate") === "true";

  // Validate secret token using constant-time comparison to prevent timing attacks
  if (!secureCompare(secret, process.env.REVALIDATE_SECRET)) {
    return NextResponse.json(
      { message: "Invalid secret token" },
      { status: 401 },
    );
  }

  // Validate tag parameter
  if (!tag) {
    return NextResponse.json(
      { message: "Missing tag parameter" },
      { status: 400 },
    );
  }

  try {
    // Next.js 16 revalidateTag requires 2 arguments:
    // - 'max' for stale-while-revalidate (recommended for most cases)
    // - { expire: 0 } for immediate expiration (for webhooks requiring instant updates)
    if (immediate) {
      revalidateTag(tag, { expire: 0 });
    } else {
      revalidateTag(tag, "max");
    }

    return NextResponse.json({
      revalidated: true,
      tag,
      mode: immediate ? "immediate" : "stale-while-revalidate",
      now: Date.now(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { message: "Error revalidating cache", error: String(err) },
      { status: 500 },
    );
  }
}
