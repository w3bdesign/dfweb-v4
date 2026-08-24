import "server-only";

import { sanityFetch } from "@/lib/sanity/client";
import { isSanityApiError } from "@/types/sanity-errors";
import type {
  Cv,
  Navigation,
  Page,
  Project,
  Settings,
} from "@/types/sanity.types";

/**
 * The content module: the single interface between the app and Sanity.
 *
 * GROQ queries, cache policy, revalidation tags, and error mapping are all
 * implementation details of this module. Routes call the named functions
 * below and receive typed data or a well-mapped error — nothing else
 * crosses the seam.
 *
 * Every content type is tagged, so the /api/revalidate webhook can
 * invalidate any of them instantly (e.g. ?tag=cv). The 24-hour revalidate
 * window acts as a fallback when no webhook fires.
 */

const REVALIDATE_SECONDS = 86400; // 24 hours

/** Cache tags — the /api/revalidate route accepts any of these. */
export const CONTENT_TAGS = {
  projects: "projects",
  cv: "cv",
  pageContent: "page-content",
  navigation: "navigation",
  settings: "settings",
} as const;

const projectsQuery = `
  *[_type == "project" && published == true] | order(featureOrder asc) {
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

const cvQuery = `
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

const pageContentQuery = `
  *[_type == 'page' && (slug.current == 'hjem' || title == 'Hjem')] | order(defined(slug.current) desc)[0]{
    "id": _id,
    title,
    hero,
    content
  }
`;

const navigationQuery = `
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

const settingsQuery = `
  *[_type == "settings"][0] {
    footerCopyrightText
  }
`;

/**
 * Maps low-level Sanity/network errors to stable, user-presentable errors.
 * Applied uniformly to every content fetch — this is the only place in the
 * codebase that knows what a Sanity error looks like.
 */
function mapError(error: unknown, entity: string): never {
  console.error("Error fetching content:", entity, error);

  if (isSanityApiError(error)) {
    switch (error.statusCode) {
      case 401:
        throw new Error("Authentication failed");
      case 403:
        throw new Error("Insufficient permissions");
      case 429:
        throw new Error("Rate limit exceeded");
      default:
        throw new Error(`Sanity API error: ${error.message}`);
    }
  }

  if (error instanceof Error && error.name === "TimeoutError") {
    throw new Error("Request timed out");
  }

  throw new Error(`Failed to fetch ${entity}`);
}

async function fetchContent<T>(
  entity: string,
  query: string,
  tag: string,
): Promise<T> {
  try {
    return await sanityFetch<T>({
      query,
      revalidate: REVALIDATE_SECONDS,
      tags: [tag],
    });
  } catch (error) {
    mapError(error, entity);
  }
}

/** All published projects, ordered by featureOrder. */
export function getProjects(): Promise<Project[]> {
  return fetchContent<Project[]>(
    "projects",
    projectsQuery,
    CONTENT_TAGS.projects,
  );
}

/** The CV document, or null when none is published. */
export function getCv(): Promise<Cv | null> {
  return fetchContent<Cv | null>("cv", cvQuery, CONTENT_TAGS.cv);
}

/** Home page content (hero + sections), or null when missing. */
export function getPageContent(): Promise<Page | null> {
  return fetchContent<Page | null>(
    "page content",
    pageContentQuery,
    CONTENT_TAGS.pageContent,
  );
}

/** Site navigation links. */
export function getNavigation(): Promise<Navigation> {
  return fetchContent<Navigation>(
    "navigation",
    navigationQuery,
    CONTENT_TAGS.navigation,
  );
}

/** Site-wide settings (footer text etc.). */
export function getSettings(): Promise<Settings> {
  return fetchContent<Settings>(
    "settings",
    settingsQuery,
    CONTENT_TAGS.settings,
  );
}

/**
 * Kicks off the projects fetch without awaiting it, so the request is
 * already in flight when the Suspense boundary renders. Next.js dedupes
 * the underlying fetch, so the awaited call in the page reuses it.
 */
export function preloadProjects(): void {
  void getProjects().catch(() => {
    // Swallow here; the awaited call in the page surfaces the error.
  });
}
