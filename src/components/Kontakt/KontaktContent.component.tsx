"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "@emailjs/browser";

import Button from "@/components/UI/Button.component";
import PageHeader from "@/components/UI/PageHeader.component";
import InputField from "@/components/UI/InputField.component";
import { useRef, useState } from "react";

const schema = z.object({
  navn: z.string().min(1, "Fullt navn er påkrevd"),
  telefon: z.string().regex(/^[0-9]{8}$/, "Telefonnummer må være 8 sifre"),
  tekst: z.string().min(1, "Hva ønsker du å si? er påkrevd"),
});

type FormData = z.infer<typeof schema>;

/**
 * Renders contact form. Uses EmailJS to send the emails.
 * @function KontaktContent
 * @returns {JSX.Element} - Rendered component
 */

const KontaktContent = () => {
  const formRef = useRef<any>("test");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [serverResponse, setServerResponse] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * Handles the form submission and sends an email using the provided API keys.
   *
   * @param {FormData} data - The form data.
   * @return {void} No return value.
   */
  const onSubmit = (data: FormData) => {
    const EMAIL_API_KEY = process.env.NEXT_PUBLIC_EMAIL_API_KEY ?? "changeme";
    const TEMPLATE_KEY =
      process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_KEY ?? "changeme";
    const SERVICE_KEY = process.env.NEXT_PUBLIC_EMAIL_SERVICE_KEY ?? "changeme";

    // Disable button
    setSubmitting(true);

    emailjs.init(EMAIL_API_KEY);

    //emailjs.sendForm(SERVICE_KEY, TEMPLATE_KEY, data).then(
    emailjs.sendForm(SERVICE_KEY, TEMPLATE_KEY, formRef.current).then(
      () => {
        setServerResponse("Takk for din beskjed");
      },
      () => {
        setServerResponse("Feil under sending av skjema");
      }
    );
  };

  return (
    <main data-testid="kontaktcontent" id="maincontent">
      <div className="mt-32 bg-graybg">
        <PageHeader>Kontakt</PageHeader>
        <div className="px-4 lg:px-0 xl:px-0 md:px-0">
          <div className="container mx-auto bg-slate-700 rounded shadow sm:mb-4">
            <div className="p-4 mx-auto md:h-full mt-4 flex flex-col justify-center items-center min-h-[470px]">
              <div className="bg-gray-800 p-6 rounded-lg md:pt-8">
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
                    ref={formRef}
                  >
                    <fieldset>
                      <legend className="text-center mx-auto text-xl mt-4 sr-only">
                        Kontaktskjema
                      </legend>
                      <div>
                        <InputField
                          inputName="navn"
                          label="Fullt navn"
                          htmlFor="navn"
                          inputPattern="[a-zA-ZæøåÆØÅ ]+"
                          title="Vennligst bruk norske bokstaver"
                          isRequired
                          {...register("navn")}
                        />
                        {errors.navn && (
                          <p className="text-red-500">{errors.navn.message}</p>
                        )}
                      </div>
                      <br />
                      <div>
                        <InputField
                          inputName="telefon"
                          label="Telefonnummer"
                          htmlFor="telefon"
                          isRequired
                          inputPattern=".[0-9]{7}"
                          title="Vennligst bruk bare tall"
                          {...register("telefon")}
                        />
                        {errors.telefon && (
                          <p className="text-red-500">
                            {errors.telefon.message}
                          </p>
                        )}
                      </div>
                      <br />
                      <div>
                        <InputField
                          inputName="tekst"
                          type="textarea"
                          label="Hva ønsker du å si?"
                          htmlFor="tekst"
                          isRequired
                          {...register("tekst")}
                        />
                        {errors.tekst && (
                          <p className="text-red-500">{errors.tekst.message}</p>
                        )}
                      </div>
                      <br />
                    </fieldset>
                    <div className="-mt-4">
                      <Button disabled={submitting}>Send skjema</Button>
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
