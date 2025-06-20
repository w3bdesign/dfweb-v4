import RootLayout from "../RootLayout";
import KontaktContent from "@/components/Kontakt/KontaktContent.component";
import { generateCSRFToken } from "@/lib/csrf";

import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Kontakt - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

export default async function PostIndex() {
  // Generate CSRF token server-side
  const csrfToken = generateCSRFToken();

  return (
    <RootLayout>
      <KontaktContent csrfToken={csrfToken} />
    </RootLayout>
  );
}
