"use client";

import { useState } from "react";
import PageHeader from "@/components/UI/PageHeader.component";
import Form from "@/components/Kontakt/Form.component";
import FormResponse from "@/components/Kontakt/FormResponse.component";

/**
 * Renders contact form. Uses EmailJS to send the emails.
 * @function KontaktContent
 * @returns {JSX.Element} - Rendered component
 */

const KontaktContent = () => {
  const [serverResponse, setServerResponse] = useState<string>("");

  return (
    <main data-testid="kontaktcontent" id="maincontent">
      <div className="mt-32 bg-graybg">
        <PageHeader>Kontakt</PageHeader>
        <div className="px-4 lg:px-0 xl:px-0 md:px-0">
          <div className="container mx-auto bg-slate-700 rounded shadow sm:mb-4">
            <div className="p-4 mx-auto md:h-full mt-4 flex flex-col justify-center items-center min-h-[470px]">
              <div className="bg-gray-800 p-6 rounded-lg pt-4">
                {serverResponse ? (
                  <FormResponse message={serverResponse} />
                ) : (
                  <Form setServerResponse={setServerResponse} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default KontaktContent;
