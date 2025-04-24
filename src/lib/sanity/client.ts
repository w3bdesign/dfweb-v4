import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";
import type { Project } from "@/types/sanity.types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "41s7iutf";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: NonNullable<Project["projectimage"]>) {
  return builder.image(source);
}
