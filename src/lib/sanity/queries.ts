export const projectsQuery = `
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
`;

export const cvQuery = `
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
`;

export const pageContentQuery = `
  *[_type == 'page' && title match 'Hjem'][0]{
    "id": _id, 
    title, 
    hero, 
    content
  }
`;

export const navigationQuery = `
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

export const settingsQuery = `
  *[_type == "settings"][0] {
    footerCopyrightText
  }
`;
