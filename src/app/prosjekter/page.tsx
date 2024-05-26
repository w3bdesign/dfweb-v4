import Header from "@/components/header";
import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";

import type { Project } from "@/types/sanity.types";
import ProsjekterListings from "@/components/Prosjekter/ProsjekterListings.component";

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
      <h1>Page</h1>
      <div>
        {posts &&
          posts.map((project: any) => (
            <div key={project.id}>
              <h1>{project.name}</h1>
              <h2>{project.description}</h2>
              <p>{project.subdescription}</p>
              <a href={project.urlwww}>Website</a>
              <a href={project.urlgithub}>GitHub</a>
            </div>
          ))}
      </div>
    </>
  );
}
