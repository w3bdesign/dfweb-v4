"use client";

import React, { useState } from "react";

import emailjs from "@emailjs/browser";

import PageHeader from "@/components/UI/PageHeader.component";
import GenericForm from "@/components/UI/GenericForm.component";

import { formSchema, formFields, FormData } from "./config/formConfig";

/**
 * Props for the KontaktContent component.
 */
type Props = {
  /**
   * Optional custom submit handler. If provided, this function will be called
   * instead of the default emailjs submission. It should handle the submission
   * logic and return a promise that resolves to a message string.
   */
  onSubmit?: (data: FormData) => Promise<string>;
  /**
   * Optional initial response message to display.
   */
  initialResponse?: string;
  /**
   * CSRF token for form security
   */
  csrfToken?: string;
};

/**
 * Renders the contact form.
 * Uses EmailJS to send emails by default, but can accept a custom onSubmit handler.
 * @function KontaktContent
 * @param {Props} props - The component props.
 * @returns {JSX.Element} - Rendered component
 */
const KontaktContent: React.FC<Props> = ({
  onSubmit: onSubmitProp,
  initialResponse = "",
  csrfToken = "",
}) => {
  const [serverResponse, setServerResponse] = useState<string>(initialResponse);

  /**
   * Default form submission handler using EmailJS.
   * Sends an email using the provided API keys.
   * @param {FormData} data - The form data.
   * @return {Promise<string>} A promise that resolves to a success or error message.
   */
  const defaultOnSubmit = async (data: FormData): Promise<string> => {
    const EMAIL_API_KEY = process.env.NEXT_PUBLIC_EMAIL_API_KEY ?? "changeme";
    const TEMPLATE_KEY =
      process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_KEY ?? "changeme";
    const SERVICE_KEY = process.env.NEXT_PUBLIC_EMAIL_SERVICE_KEY ?? "changeme";

    try {
      emailjs.init(EMAIL_API_KEY);
      await emailjs.send(SERVICE_KEY, TEMPLATE_KEY, data);
      return "Takk for din beskjed";
    } catch {
      return "Feil under sending av skjema";
    }
  };

  const handleSubmit = onSubmitProp ?? defaultOnSubmit;

  /**
   * Handles the actual form submission, calling the appropriate submit handler
   * (either the provided prop or the default) and updates the server response.
   * @param {FormData} data - The form data.
   */
  const handleFormSubmit = async (data: FormData): Promise<void> => {
    const message = await handleSubmit(data);
    setServerResponse(message);
  };

  return (
    <main data-testid="kontaktcontent" id="maincontent">
      <div className="mt-32 bg-graybg">
        <PageHeader>Kontakt</PageHeader>
        <div className="px-4 lg:px-0 xl:px-0 md:px-0">
          <div className="container mx-auto bg-slate-700 rounded-sm shadow-sm sm:mb-4">
            <div className="p-4 mx-auto md:h-full mt-4 flex flex-col justify-center items-center min-h-[470px]">
              <div className="p-2 md:p-6 pt-8">
                {serverResponse ? (
                  <h3 className="m-2 h-32 text-xl text-center text-gray-300">
                    {serverResponse}
                  </h3>
                ) : (
                  <div className="bg-gray-800 p-4 md:p-6 rounded-lg pt-8">
                    <GenericForm
                      formSchema={formSchema}
                      onSubmit={handleFormSubmit}
                      fields={formFields}
                      submitButtonText="Send skjema"
                      csrfToken={csrfToken}
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
