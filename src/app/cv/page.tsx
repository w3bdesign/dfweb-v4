import RootLayout from "../RootLayout";
import CVContent from "@/components/CV/CVContent.component";

import { client } from "@/lib/sanity/client";
import { cvQuery } from "@/lib/sanity/queries";

import { Metadata } from "next/types";

// Metadata for the CV page
export const metadata: Metadata = {
  title: "CV - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

// Define the type for cvData
interface CVData {
  keyQualifications: string[];
  experience: Array<{
    period: string;
    company: string;
    role: string;
    description: string;
  }>;
  education: Array<{
    period: string;
    institution: string;
    degree: string;
    description: string;
  }>;
}

// Fetch and render the CV page
export default async function CVPage() {
  // Fetch the CV data from Sanity
  const cvData: CVData = await client.fetch(cvQuery);

  return (
    <RootLayout>
      {/* Render the CVContent component with the fetched cvData */}
      <CVContent cvData={cvData} />
    </RootLayout>
  );
}
