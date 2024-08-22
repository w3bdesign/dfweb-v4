import RootLayout from "../RootLayout";
import ContactForm from "@/components/Kontakt/ContactForm.component";
import PageHeader from "@/components/UI/PageHeader.component";

import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Kontakt - Dfweb",
  description: "Daniel Fjeldstad | Frontend Web Utvikler | Portefølje",
};

export default function KontaktPage() {
  return (
    <RootLayout>
      <main data-testid="kontaktcontent" id="maincontent">
        <div className="mt-32 bg-graybg">
          <PageHeader>Kontakt</PageHeader>
          <div className="px-4 lg:px-0 xl:px-0 md:px-0">
            <div className="container mx-auto bg-slate-700 rounded shadow sm:mb-4">
              <div className="p-4 mx-auto md:h-full mt-4 flex flex-col justify-center items-center min-h-[470px]">
                <div className="bg-gray-800 p-6 rounded-lg pt-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </RootLayout>
  );
}
