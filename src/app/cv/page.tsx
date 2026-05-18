import { notFound } from "next/navigation";
import CVContent from "@/components/CV/CVContent.component";

import { sanityFetch } from "@/lib/sanity/client";
import { cvQuery } from "@/lib/sanity/queries";
import type { Cv } from "@/types/sanity.types";

import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "CV - Dfweb",
};

export default async function CVPage() {
  const cvData = await sanityFetch<Cv | null>({
    query: cvQuery,
    revalidate: 3600,
  });

  if (!cvData) notFound();

  return <CVContent cvData={cvData} />;
}
