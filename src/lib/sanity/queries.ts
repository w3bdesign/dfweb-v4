import { defineQuery } from "next-sanity";

export const projectsQuery = defineQuery(`
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
    projectimage,
    featured,
    featureOrder
  }
`);

export const cvQuery = defineQuery(`
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
    },
    volunteerWork[] {
      period,
      organization,
      role,
      description
    }
  }
`);

export const pageContentQuery = defineQuery(`
  *[_type == 'page' && title match 'Hjem'][0]{
    "id": _id,
    title,
    hero,
    content
  }
`);

export const navigationQuery = defineQuery(`
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
`);

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0] {
    footerCopyrightText
  }
`);

export const POSTS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current)][0...12]{
  _id, title, slug
}`);

export const POST_QUERY =
  defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  title, body, mainImage
}`);
