import RootLayout from "../RootLayout";
import PageHeader from "@/components/UI/PageHeader.component";
import ProsjektCard from "@/components/Prosjekter/ProsjektCard.component";

import { client } from "@/lib/sanity/client";
import { projectsQuery } from "@/lib/sanity/queries";

import type { Project } from "@/types/sanity.types";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Prosjekter - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

export default async function Prosjekter() {
  const posts: Project[] = await client.fetch(projectsQuery);

  // Sort by featureOrder, putting null/undefined values last
  const sortedProjects = [...posts].sort((a, b) => {
    if (a.featureOrder === null || a.featureOrder === undefined) return 1;
    if (b.featureOrder === null || b.featureOrder === undefined) return -1;
    return a.featureOrder - b.featureOrder;
  });

  return (
    <RootLayout>
      <main
        role="main"
        aria-label="Innhold portefølje"
        className="mt-32 bg-graybg"
      >
        <PageHeader>Prosjekter</PageHeader>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-8">
            {sortedProjects.map((project) => (
              <ProsjektCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </main>
    </RootLayout>
  );
}
