import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient, type QueryParams } from "@sanity/client";
import type { Project } from "@/types/sanity.types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "41s7iutf";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-01";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Typed fetch helper with consistent caching defaults.
 * Applies time-based revalidation (default 86400s = 24 hours) or tag-based invalidation.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 86400,
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T> {
  return client.fetch<T>(query, params, {
    cache: 'force-cache', // Explicitly enable caching (Next.js 15+ requires this)
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}

const builder = createImageUrlBuilder(client);

export function urlFor(source: NonNullable<Project["projectimage"]>) {
  return builder.image(source);
}
