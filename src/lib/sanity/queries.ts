import { groq } from "next-sanity";

export const projectsQuery = groq`
  *[_type == "project"] | order(featureOrder asc) {
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
    "projectimage": projectimage.asset->url,
    featured,
    featureOrder
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

export const pageContentQuery = groq`
  *[_type == 'page' && title match 'Hjem'][0]{
    "id": _id, 
    title, 
    hero, 
    content
  }
`;

export const navigationQuery = groq`
  *[_type == "navigation"][0] {
    title,
    links[] {
      title,
      name,
      hash,
      href,
      externalLink
    }
  }
`;
