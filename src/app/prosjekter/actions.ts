import { client } from "@/lib/sanity/client";
import { projectsQuery } from "@/lib/sanity/queries";
import type { Project } from "@/types/sanity.types";

export async function getProjects(): Promise<Project[]> {
  try {
    // Add a small delay to demonstrate loading state
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const projects = await client.fetch(projectsQuery, {}, {
      // Enable Incremental Static Regeneration with a 1 hour revalidation period
      next: { revalidate: 3600 }
    });
    
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
}
