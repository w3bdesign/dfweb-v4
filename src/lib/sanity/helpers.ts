import { client } from "./client";
import imageUrlBuilder from "@sanity/image-url";

import type { Project } from "@/types/sanity.types";

const builder = imageUrlBuilder(client);

export const urlFor = (source: NonNullable<Project["projectimage"]>) => {
  return builder.image(source);
};
