import { client } from "@/lib/sanity/client";
import { projectsQuery } from "@/lib/sanity/queries";
import type { Project } from "@/types/sanity.types";
import { isSanityApiError } from "@/types/sanity-errors";

export async function getProjects(): Promise<Project[]> {
  try {
    // Add a small delay to demonstrate loading state
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const projects = await client.fetch(
      projectsQuery,
      {},
      {
        // Enable Incremental Static Regeneration with a 1 hour revalidation period
        next: { revalidate: 3600 },
      },
    );

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    
    if (isSanityApiError(error)) {
      switch (error.statusCode) {
        case 401:
          throw new Error("Authentication failed");
        case 403:
          throw new Error("Insufficient permissions");
        case 429:
          throw new Error("Rate limit exceeded");
        case 400:
          throw new Error(`Sanity API error: ${error.message}`);
        default:
          throw new Error(`Sanity API error: ${error.message}`);
      }
    }

    // Handle network or other non-Sanity errors
    if (error instanceof Error) {
      if (error.name === "TimeoutError") {
        throw new Error("Request timed out");
      }
    }
    
    throw new Error("Failed to fetch projects");
  }
}
