"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";

import Button from "@/components/UI/Button.component";
import InputField from "@/components/UI/InputField.component";
import { FormData, formSchema } from "./FormSchema";
import { handleSubmit } from "./SubmitHandler";

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [serverResponse, setServerResponse] = useState<string>("");

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      await handleSubmit(data);
      setServerResponse("Takk for din beskjed");
      reset();
    } catch (error) {
      setServerResponse("Feil under sending av skjema");
    }
  };

  if (serverResponse) {
    return (
      <h3 className="m-6 h-64 text-2xl md:text-3xl text-center text-gray-300">
        {serverResponse}
      </h3>
    );
  }

  return (
    <form
      id="contact-form"
      className="text-center"
      onSubmit={hookFormSubmit(onSubmit)}
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
  );
};

export default ContactForm;
