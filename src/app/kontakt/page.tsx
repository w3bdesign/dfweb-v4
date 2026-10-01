import ContactForm from "@/components/Kontakt/ContactForm.component";
import { generateCSRFToken } from "@/lib/csrf";

import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Kontakt - Dfweb",
};

// Generate a fresh CSRF token per request at runtime rather than baking a
// single token into the statically prerendered HTML (which would be shared
// across all users, expire, and require CSRF_SECRET at build time).
export const dynamic = "force-dynamic";

export default async function PostIndex() {
  // Generate CSRF token server-side
  const csrfToken = generateCSRFToken();

  return <ContactForm csrfToken={csrfToken} />;
}
