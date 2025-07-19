"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";

import PageHeader from "@/components/UI/PageHeader.component";
import Button from "@/components/UI/Button.component";
import InputField from "@/components/UI/InputField.component";
import { formSchema, FormData } from "./config/formConfig";

interface ContactFormProps {
  csrfToken?: string;
  onSubmit?: (data: FormData) => Promise<string>;
  initialResponse?: string;
}

/**
 * ContactForm component - A complete contact form with EmailJS integration
 * Handles both the form UI and submission logic in a single, clear component
 */
const ContactForm: React.FC<ContactFormProps> = ({
  csrfToken = "",
  onSubmit: onSubmitProp,
  initialResponse = "",
}) => {
  const [serverResponse, setServerResponse] = useState<string>(initialResponse);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  /**
   * Default form submission handler using EmailJS.
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

  const handleFormSubmit = async (data: FormData): Promise<void> => {
    const submitHandler = onSubmitProp ?? defaultOnSubmit;
    const message = await submitHandler(data);
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
                    <form
                      id="contact-form"
                      className="text-center"
                      onSubmit={handleSubmit(handleFormSubmit)}
                      method="POST"
                      action="/api/form"
                      aria-label="Contact Form"
                    >
                      {csrfToken && (
                        <input type="hidden" name="_csrf" value={csrfToken} />
                      )}
                      <fieldset>
                        <legend className="text-center mx-auto text-xl mt-4 sr-only">
                          Kontaktskjema
                        </legend>

                        <InputField<FormData>
                          name="navn"
                          label="Fullt navn"
                          htmlFor="navn"
                          register={register}
                          error={errors.navn?.message}
                          isRequired
                          inputPattern={/^[a-zA-ZæøåÆØÅ ]+$/}
                          title="Vennligst bruk norske bokstaver"
                        />
                        <br />

                        <InputField<FormData>
                          name="telefon"
                          label="Telefonnummer"
                          htmlFor="telefon"
                          register={register}
                          error={errors.telefon?.message}
                          isRequired
                          inputPattern={/^\d{8}$/}
                          title="Vennligst oppgi et gyldig telefonnummer"
                        />
                        <br />

                        <InputField<FormData>
                          name="tekst"
                          label="Hva ønsker du å si?"
                          htmlFor="tekst"
                          register={register}
                          error={errors.tekst?.message}
                          isRequired
                          type="textarea"
                        />
                        <br />
                      </fieldset>

                      <div className="-mt-4">
                        <Button
                          disabled={isSubmitting}
                          data-testid="submit-button"
                        >
                          Send skjema
                        </Button>
                      </div>
                    </form>
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

export default ContactForm;
