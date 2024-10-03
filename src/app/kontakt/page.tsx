import RootLayout from "../RootLayout";
import KontaktContent from "@/components/Kontakt/KontaktContent.component";

import { Metadata } from "next/types";

// Metadata for the Kontakt page
export const metadata: Metadata = {
  title: "Kontakt - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

// Render the Kontakt page
export default async function PostIndex() {
  return (
    <RootLayout>
      {/* Render the KontaktContent component */}
      <KontaktContent />
    </RootLayout>
  );
}
