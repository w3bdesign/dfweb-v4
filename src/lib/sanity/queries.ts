import { groq } from "next-sanity";

export const projectsQuery = groq`
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