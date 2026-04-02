import { Suspense } from "react";
import type { Metadata } from "next/types";

import PageHeader from "@/components/UI/PageHeader.component";
import ProsjektCard from "@/components/Prosjekter/ProsjektCard.component";
import RotatingLoader from "@/components/Animations/RotatingLoader.component";

import { getProjects, preloadProjects } from "./actions";

export const metadata: Metadata = {
  title: "Prosjekter - Dfweb",
};

async function ProjectList() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={index % 2 === 1 ? "xl:translate-y-12" : ""}
          >
            <ProsjektCard
              {...project}
              staggerDelay={(index % 2) * 0.15}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Prosjekter() {
  // Start fetching projects data as early as possible
  preloadProjects();

  return (
    <main aria-label="Innhold portefølje" className="mt-32 bg-graybg">
      <PageHeader>Prosjekter</PageHeader>
      <Suspense fallback={<RotatingLoader />}>
        <ProjectList />
      </Suspense>
    </main>
  );
}
