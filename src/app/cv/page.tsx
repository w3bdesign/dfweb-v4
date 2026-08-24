import { notFound } from "next/navigation";
import CVContent from "@/components/CV/CVContent.component";

import { getCv } from "@/lib/sanity/content";

import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "CV - Dfweb",
};

export default async function CVPage() {
  const cvData = await getCv();

  if (!cvData) notFound();

  return <CVContent cvData={cvData} />;
}
