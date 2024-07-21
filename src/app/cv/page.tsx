import Header from "@/components/Layout/Header.component";
import CVContent from "@/components/CV/CVContent.component";

import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "CV - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

export default async function PostIndex() {
  return (
    <>
      <Header />
      <CVContent />
    </>
  );
}
