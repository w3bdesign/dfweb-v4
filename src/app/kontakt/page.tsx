import Header from "@/components/Layout/Header.component";

import KontaktContent from "@/components/Kontakt/KontaktContent.component";

import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Kontakt - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

export default async function PostIndex() {
  return (
    <>
      <Header />
      <KontaktContent />
    </>
  );
}
