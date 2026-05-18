import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient, type QueryParams } from "@sanity/client";
import type { Project } from "@/types/sanity.types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "41s7iutf";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Typed fetch helper with consistent caching defaults.
 * Applies time-based revalidation (default 3600s) or tag-based invalidation.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 3600,
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T> {
  return client.fetch<T>(query, params, {
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
