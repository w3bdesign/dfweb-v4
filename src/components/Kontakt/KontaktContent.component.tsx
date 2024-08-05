"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "@emailjs/browser";

import Button from "@/components/UI/Button.component";
import PageHeader from "@/components/UI/PageHeader.component";
import InputField from "@/components/UI/InputField.component";

const formSchema = z.object({
  navn: z
    .string()
    .min(1, "Navn er påkrevd")
    .regex(/^[a-zA-ZæøåÆØÅ ]+$/, "Vennligst bruk norske bokstaver"),
  telefon: z
    .string()
    .min(8, "Telefonnummer må være minst 8 siffer")
    .regex(/^[0-9]+$/, "Vennligst bruk bare tall"),
  tekst: z.string().min(1, "Melding er påkrevd"),
});

type FormData = z.infer<typeof formSchema>;

const KontaktContent = () => {
  const [serverResponse, setServerResponse] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
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
                  >
                    <fieldset>
                      <legend className="text-center mx-auto text-xl mt-4 sr-only">
                        Kontaktskjema
                      </legend>
                      <InputField
                        inputName="navn"
                        label="Fullt navn"
                        htmlFor="navn"
                        register={register}
                        error={errors.navn}
                        isRequired={true}
                      />
                      <br />
                      <InputField
                        inputName="telefon"
                        label="Telefonnummer"
                        htmlFor="telefon"
                        register={register}
                        error={errors.telefon}
                        isRequired={true}
                      />
                      <br />
                      <InputField
                        inputName="tekst"
                        type="textarea"
                        label="Hva ønsker du å si?"
                        htmlFor="tekst"
                        register={register}
                        error={errors.tekst}
                        isRequired={true}
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
