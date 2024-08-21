"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import { useState } from "react";

import Button from "@/components/UI/Button.component";
import PageHeader from "@/components/UI/PageHeader.component";
import InputField from "@/components/UI/InputField.component";

const formSchema = z.object({
  navn: z.string().min(1, "Fullt navn er påkrevd").regex(/^[a-zA-ZæøåÆØÅ ]+$/, "Vennligst bruk norske bokstaver"),
  telefon: z.string().min(1, "Telefonnummer er påkrevd").regex(/^[0-9]{8}$/, "Vennligst oppgi et gyldig telefonnummer"),
  tekst: z.string().min(1, "Beskjed er påkrevd"),
});

type FormData = z.infer<typeof formSchema>;

/**
 * Renders contact form. Uses EmailJS to send the emails.
 * @function KontaktContent
 * @returns {JSX.Element} - Rendered component
 */

const KontaktContent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [serverResponse, setServerResponse] = useState<string>("");

  /**
   * Handles the form submission and sends an email using the provided API keys.
   *
   * @param {FormData} data - The form data.
   * @return {Promise<void>} No return value.
   */
  const onSubmit = async (data: FormData): Promise<void> => {
    const EMAIL_API_KEY = process.env.NEXT_PUBLIC_EMAIL_API_KEY ?? "changeme";
    const TEMPLATE_KEY = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_KEY ?? "changeme";
    const SERVICE_KEY = process.env.NEXT_PUBLIC_EMAIL_SERVICE_KEY ?? "changeme";

    try {
      emailjs.init(EMAIL_API_KEY);
      await emailjs.send(SERVICE_KEY, TEMPLATE_KEY, data);
      setServerResponse("Takk for din beskjed");
      reset();
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
              <div className="bg-gray-800 p-6 rounded-lg pt-4">
                {serverResponse ? (
                  <h3 className="m-6 h-64 text-2xl md:text-3xl text-center text-gray-300">
                    {serverResponse}
                  </h3>
                ) : (
                  <form
                    id="contact-form"
                    className="text-center"
                    onSubmit={handleSubmit(onSubmit)}
                    method="POST"
                    action="/api/form"
                    aria-label="Contact Form"
                  >
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
                        inputPattern={/^[0-9]{8}$/}
                        title="Vennligst oppgi et gyldig telefonnummer"
                      />
                      <br />
                      <InputField<FormData>
                        name="tekst"
                        type="textarea"
                        label="Hva ønsker du å si?"
                        htmlFor="tekst"
                        register={register}
                        error={errors.tekst?.message}
                        isRequired
                      />
                      <br />
                    </fieldset>
                    <div className="-mt-4">
                      <Button disabled={isSubmitting}>Send skjema</Button>
                    </div>
                  </form>
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
