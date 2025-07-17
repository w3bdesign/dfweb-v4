"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/UI/Button.component";
import InputField from "@/components/UI/InputField.component";
import { formSchema, FormData } from "./config/formConfig";

interface ContactFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  csrfToken?: string;
}

/**
 * A simplified contact form component that directly uses the form schema
 * without complex generic abstractions.
 */
const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, csrfToken }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <form
      id="contact-form"
      className="text-center"
      onSubmit={handleSubmit(onSubmit)}
      method="POST"
      action="/api/form"
      aria-label="Contact Form"
    >
      {csrfToken && <input type="hidden" name="_csrf" value={csrfToken} />}
      <fieldset>
        <legend className="text-center mx-auto text-xl mt-4 sr-only">
          Kontaktskjema
        </legend>

        {/* Navn field */}
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

        {/* Telefon field */}
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

        {/* Tekst field */}
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
        <Button disabled={isSubmitting} data-testid="submit-button">
          Send skjema
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
