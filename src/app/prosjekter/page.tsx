import Header from "@/components/Layout/Header.component";
import PageHeader from "@/components/UI/PageHeader.component";
import ProsjektCard from "@/components/Prosjekter/ProsjektCard.component";

import { projectsQuery } from "@/lib/sanity/queries";
import { client } from "@/lib/sanity/client";

export default async function Prosjekter() {
  const posts = await client.fetch(projectsQuery);

  return (
    <>
      <Header />
      <main
        role="main"
        aria-label="Innhold portefølje"
        className="mt-32 bg-graybg"
      >
        <PageHeader>Prosjekter</PageHeader>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-8">
          {posts?.map((project) => (
            <ProsjektCard key={project.id} {...project} />
          ))}
        </div>
      </main>
    </>
  );
}
