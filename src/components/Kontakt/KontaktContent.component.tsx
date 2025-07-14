"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";

import PageHeader from "@/components/UI/PageHeader.component";
import { contactFields, ContactFormData } from "./config/formConfig";

/**
 * Props for the KontaktContent component.
 */
type Props = {
  /**
   * Optional custom submit handler. If provided, this function will be called
   * instead of the default emailjs submission. It should handle the submission
   * logic and return a promise that resolves to a message string.
   */
  onSubmit?: (data: ContactFormData) => Promise<string>;
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
  const [form, setForm] = useState<ContactFormData>({
    navn: "",
    telefon: "",
    tekst: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Validate using Zod schema, but show required errors before regex errors
  const validate = (data: ContactFormData) => {
    const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};

    // Required field errors
    if (!data.navn) fieldErrors.navn = "Fullt navn er påkrevd";
    if (!data.telefon) fieldErrors.telefon = "Telefonnummer er påkrevd";
    if (!data.tekst) fieldErrors.tekst = "Beskjed er påkrevd";

    // Only run regex if not empty
    if (data.navn && !/^[a-zA-ZæøåÆØÅ ]+$/.test(data.navn)) {
      fieldErrors.navn = "Vennligst bruk norske bokstaver";
    }
    if (data.telefon && !/^\d{8}$/.test(data.telefon)) {
      fieldErrors.telefon = "Vennligst oppgi et gyldig telefonnummer";
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  // Default form submission handler using EmailJS
  const defaultOnSubmit = async (data: ContactFormData): Promise<string> => {
    const EMAIL_API_KEY = process.env.NEXT_PUBLIC_EMAIL_API_KEY ?? "changeme";
    const TEMPLATE_KEY =
      process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_KEY ?? "changeme";
    const SERVICE_KEY = process.env.NEXT_PUBLIC_EMAIL_SERVICE_KEY ?? "changeme";
    try {
      emailjs.init(EMAIL_API_KEY);
      // emailjs.send expects a Record<string, any>
      await emailjs.send(SERVICE_KEY, TEMPLATE_KEY, { ...data });
      return "Takk for din beskjed";
    } catch {
      return "Feil under sending av skjema";
    }
  };

  const handleSubmit = onSubmitProp ?? defaultOnSubmit;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (validate(form)) {
      try {
        const message = await handleSubmit(form);
        setServerResponse(message);
        setForm({ navn: "", telefon: "", tekst: "" });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
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
                      onSubmit={handleFormSubmit}
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
                        {contactFields.map((field) => (
                          <div
                            className="relative my-2 flex flex-col items-center"
                            key={field.name}
                          >
                            <div className="relative">
                              {field.type === "textarea" ? (
                                <textarea
                                  id={field.name}
                                  name={field.name}
                                  placeholder={field.label}
                                  className={`cursor-pointer peer block text-xl w-64 p-2 bg-gray-800 text-slate-100 border-gray-500/50 border rounded-sm outline-hidden focus:border-slate-200 placeholder-gray-300/0 transition duration-200 ${errors[field.name as keyof ContactFormData] ? "border-red-500" : ""}`}
                                  value={
                                    form[field.name as keyof ContactFormData]
                                  }
                                  onChange={handleChange}
                                />
                              ) : (
                                <input
                                  id={field.name}
                                  name={field.name}
                                  type="text"
                                  placeholder={field.label}
                                  className={`cursor-pointer peer block text-xl w-64 p-2 bg-gray-800 text-slate-100 border-gray-500/50 border rounded-sm outline-hidden focus:border-slate-200 placeholder-gray-300/0 transition duration-200 ${errors[field.name as keyof ContactFormData] ? "border-red-500" : ""}`}
                                  value={
                                    form[field.name as keyof ContactFormData]
                                  }
                                  onChange={handleChange}
                                />
                              )}
                              <label
                                htmlFor={field.name}
                                className={`absolute cursor-pointer left-1 top-0 z-10 origin-[0] -translate-y-8 scale-75 transform bg-gray-800 px-2 text-slate-100 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-10 peer-focus:scale-75 peer-focus:px-2 peer-focus:bg-gray-800 ${
                                  field.type === "textarea"
                                    ? "cursor-pointer peer-focus:-top-4"
                                    : ""
                                }`}
                              >
                                {field.label}
                              </label>
                            </div>
                            {errors[field.name as keyof ContactFormData] && (
                              <span className="text-red-500 text-sm mt-1">
                                {errors[field.name as keyof ContactFormData]}
                              </span>
                            )}
                          </div>
                        ))}
                      </fieldset>
                      <div className="-mt-4">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                          disabled={isSubmitting}
                          data-testid="submit-button"
                        >
                          Send skjema
                        </button>
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

export default KontaktContent;
