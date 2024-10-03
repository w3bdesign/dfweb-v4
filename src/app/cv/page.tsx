import RootLayout from "../RootLayout";
import CVContent, { CVData } from "@/components/CV/CVContent.component";

import { client } from "@/lib/sanity/client";
import { cvQuery } from "@/lib/sanity/queries";

import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "CV - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

export default async function CVPage() {
  const cvData: CVData = await client.fetch(cvQuery);

  return (
    <RootLayout>
      <CVContent cvData={cvData} />
    </RootLayout>
  );
}
