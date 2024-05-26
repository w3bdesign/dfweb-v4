import Header from "@/components/header";
import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";

import type { Project } from "@/types/sanity.types";
import ProsjekterListings from "@/components/Prosjekter/ProsjekterListings.component";
import PageHeader from "@/components/UI/PageHeader.component";
import ProsjektCard from "@/components/Prosjekter/ProsjektCard";

export default async function PostIndex() {
  const projectQuery = groq`
  
*[_type == "project"]{
  id,
  name,
  description,
  subdescription,
  projectcategory->{
    _id,
    title
  },
  urlwww[]{
    ...,
    _key,
  },
  urlgithub[]{
    ...,
    _key,
  },
  "projectimage": projectimage.asset->url
}
  `;

  const posts = await client.fetch<any>(projectQuery);

  console.log(posts);

  return (
    <>
      <Header />

      <main
        role="main"
        aria-label="Innhold portefølje"
        className="mt-32 bg-graybg"
      >
        <PageHeader>Prosjekter</PageHeader>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {posts &&
            posts.map((project: any) => (
              <ProsjektCard
                key={project.id}
                id={project.id}
                name={project.name}
                description={project.description}
                subdescription={project.subdescription}
                projectimage={project.projectimage}
                urlwww={project.urlwww}
                urlgithub={project.urlgithub}
              />
            ))}
        </div>
      </main>
    </>
  );
}
