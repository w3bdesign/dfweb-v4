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

export const cvQuery = groq`
  *[_type == "cv"][0] {
    keyQualifications,
    experience[] {
      period,
      company,
      role,
      description
    },
    education[] {
      period,
      institution,
      degree,
      description
    }
  }
`;
