import ContactForm from "@/components/Kontakt/ContactForm.component";
import { generateCSRFToken } from "@/lib/csrf";

import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Kontakt - Dfweb",
};

export default async function PostIndex() {
  // Generate CSRF token server-side
  const csrfToken = generateCSRFToken();

  return <ContactForm csrfToken={csrfToken} />;
}
