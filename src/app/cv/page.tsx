import RootLayout from "../RootLayout";
import CVContent from "@/components/CV/CVContent.component";

import { client } from "@/lib/sanity/client";
import { cvQuery } from "@/lib/sanity/queries";

import { Metadata } from "next/types";
import { Pagecontent } from "@/types/sanity.types";

export const metadata: Metadata = {
  title: "CV - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

interface CVData {
  keyQualifications: string[];
  experience: Array<{
    period: string;
    company: string;
    role: string;
    description: Pagecontent["text"];
  }>;
  education: Array<{
    period: string;
    institution: string;
    degree: string;
    description: Pagecontent["text"];
  }>;
}

export default async function CVPage() {
  const cvData: CVData = await client.fetch(cvQuery);

  return (
    <RootLayout>
      <CVContent cvData={cvData} />
    </RootLayout>
  );
}
