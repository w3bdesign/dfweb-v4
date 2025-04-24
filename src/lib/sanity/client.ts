import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "41s7iutf";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Helper function to generate image URLs with the builder
const builder = imageUrlBuilder(client);

// Using 'any' for now as SanityImageSource type import caused issues.
// TODO: Investigate proper typing for the image source object.
export function urlFor(source: string) {
  return builder.image(source);
}
