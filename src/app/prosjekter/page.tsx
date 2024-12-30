import { Suspense } from 'react';
import type { Metadata } from "next/types";

import RootLayout from "../RootLayout";
import PageHeader from "@/components/UI/PageHeader.component";
import ProsjektCard from "@/components/Prosjekter/ProsjektCard.component";
import RotatingLoader from "@/components/Animations/RotatingLoader.component";

import { getProjects } from "./actions";

export const metadata: Metadata = {
  title: "Prosjekter - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

export default async function Prosjekter() {
  const projects = await getProjects();

  return (
    <RootLayout>
      <main
        role="main"
        aria-label="Innhold portefølje"
        className="mt-32 bg-graybg"
      >
        <PageHeader>Prosjekter</PageHeader>
        <Suspense fallback={<RotatingLoader />}>
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-8">
              {projects.map((project) => (
                <ProsjektCard key={project.id} {...project} />
              ))}
            </div>
          </div>
        </Suspense>
      </main>
    </RootLayout>
  );
}
