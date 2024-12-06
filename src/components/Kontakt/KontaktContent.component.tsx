"use client";

import emailjs from "@emailjs/browser";
import { useState } from "react";

import PageHeader from "@/components/UI/PageHeader.component";
import GenericForm from "@/components/UI/GenericForm.component";

import { formSchema, formFields, FormData } from "./config/formConfig";

/**
 * Renders contact form. Uses EmailJS to send the emails.
 * @function KontaktContent
 * @returns {JSX.Element} - Rendered component
 */

const KontaktContent = () => {
  const [serverResponse, setServerResponse] = useState<string>("");

  /**
   * Handles the form submission and sends an email using the provided API keys.
   *
   * @param {FormData} data - The form data.
   * @return {Promise<void>} No return value.
   */
  const onSubmit = async (data: FormData): Promise<void> => {
    const EMAIL_API_KEY = process.env.NEXT_PUBLIC_EMAIL_API_KEY ?? "changeme";
    const TEMPLATE_KEY =
      process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_KEY ?? "changeme";
    const SERVICE_KEY = process.env.NEXT_PUBLIC_EMAIL_SERVICE_KEY ?? "changeme";

    try {
      emailjs.init(EMAIL_API_KEY);
      await emailjs.send(SERVICE_KEY, TEMPLATE_KEY, data);
      setServerResponse("Takk for din beskjed");
    } catch (error) {
      setServerResponse("Feil under sending av skjema");
    }
  };

  return (
    <main data-testid="kontaktcontent" id="maincontent">
      <div className="mt-32 bg-graybg">
        <PageHeader>Kontakt</PageHeader>
        <div className="px-4 lg:px-0 xl:px-0 md:px-0">
          <div className="container mx-auto bg-slate-700 rounded shadow sm:mb-4">
            <div className="p-4 mx-auto md:h-full mt-4 flex flex-col justify-center items-center min-h-[470px]">
              <div className="p-2 md:p-6 pt-8">
                {serverResponse ? (
                  <h3 className="m-2 h-32 text-xl text-center text-gray-300">
                    {serverResponse}
                  </h3>
                ) : (
                  <div className="bg-gray-800 p-4 md:p-6 rounded-lg pt-8">
                    <GenericForm<typeof formSchema>
                      formSchema={formSchema}
                      onSubmit={onSubmit}
                      fields={formFields}
                      submitButtonText="Send skjema"
                    />
                  </div>
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
