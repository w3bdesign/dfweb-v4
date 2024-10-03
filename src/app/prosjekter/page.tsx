import RootLayout from "../RootLayout";
import PageHeader from "@/components/UI/PageHeader.component";
import ProsjektCard from "@/components/Prosjekter/ProsjektCard.component";

import { client } from "@/lib/sanity/client";

import type { Project } from "@/types/sanity.types";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Prosjekter - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

const projectsQuery = `*[_type == "project"] | order(featured desc, featureOrder asc, _createdAt desc) {
  id,
  name,
  description,
  subdescription,
  projectimage,
  urlwww,
  urlgithub,
  featured,
  featureOrder
}`;

// Fetch and render the Prosjekter page
export default async function Prosjekter() {
  // Fetch the projects data from Sanity
  const posts: Project[] = await client.fetch(projectsQuery);

  // Filter the projects into featured and non-featured
  const featuredProjects = posts.filter((project) => project.featured);
  const nonFeaturedProjects = posts.filter((project) => !project.featured);

  return (
    <RootLayout>
      <main
        role="main"
        aria-label="Innhold portefølje"
        className="mt-32 bg-graybg"
      >
        <PageHeader>Prosjekter</PageHeader>
        <div className="container mx-auto">
          {featuredProjects.length > 0 && (
            <div className="mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Render the featured projects */}
                {featuredProjects.map((project) => (
                  <ProsjektCard key={project.id} {...project} />
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Render the non-featured projects */}
            {nonFeaturedProjects.map((project) => (
              <ProsjektCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </main>
    </RootLayout>
  );
}
