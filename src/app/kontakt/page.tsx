import ContactForm from "@/components/Kontakt/ContactForm.component";

import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Kontakt - Dfweb",
};

export default function PostIndex() {
  return <ContactForm />;
}
