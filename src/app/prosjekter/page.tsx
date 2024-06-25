import Header from "@/components/Layout/Header.component";
import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";

import PageHeader from "@/components/UI/PageHeader.component";
import ProsjektCard from "@/components/Prosjekter/ProsjektCard";

export default async function Prosjekter() {
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
