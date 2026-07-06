import { unstable_cache } from "next/cache";
import "server-only";

import { sanityFetch } from "@/lib/sanity/client";
import { projectsQuery } from "@/lib/sanity/queries";

import type { Project } from "@/types/sanity.types";
import { isSanityApiError } from "@/types/sanity-errors";

async function fetchProjectsFromSanity(): Promise<Project[]> {
  return sanityFetch<Project[]>({
    query: projectsQuery,
    revalidate: 86400, // 24 hours
  });
}

function handleError(error: unknown): never {
  console.error("Error fetching projects:", error);

  if (isSanityApiError(error)) {
    switch (error.statusCode) {
      case 401:
        throw new Error("Authentication failed");
      case 403:
        throw new Error("Insufficient permissions");
      case 429:
        throw new Error("Rate limit exceeded");
      default:
        throw new Error(`Sanity API error: ${error.message}`);
    }
  }

  if (error instanceof Error && error.name === "TimeoutError") {
    throw new Error("Request timed out");
  }

  throw new Error("Failed to fetch projects");
}

export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    try {
      return await fetchProjectsFromSanity();
    } catch (error) {
      handleError(error);
    }
  },
  ['projects-list'], // Cache key
  {
    revalidate: 86400, // 24 hours
    tags: ['projects'], // For on-demand revalidation
  }
);

export function preloadProjects(): void {
  getProjects();
}
