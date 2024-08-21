import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import emailjs from "@emailjs/browser";
import FormField from "./FormField.component";
import FormResponse from "./FormResponse.component";

interface IFormInput {
  fulltNavn: string;
  telefonNummer: string;
  hvaOnskerDu: string;
}

interface FormProps {
  setServerResponse: (response: string) => void;
}

const Form: React.FC<FormProps> = ({ setServerResponse }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsSubmitting(true);
    try {
      await emailjs.send(
        "service_id",
        "template_id",
        data,
        "user_id"
      );
      setServerResponse("Takk for din beskjed");
    } catch (error) {
      setServerResponse("Feil under sending av skjema");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        name="fulltNavn"
        label="Fullt navn"
        htmlFor="fulltNavn"
        isRequired
        register={register}
        error={errors.fulltNavn?.message}
      />
      <FormField
        name="telefonNummer"
        label="Telefonnummer"
        htmlFor="telefonNummer"
        isRequired
        inputPattern={/^\d{8}$/}
        title="Vennligst oppgi et gyldig telefonnummer"
        register={register}
        error={errors.telefonNummer?.message}
      />
      <FormField
        name="hvaOnskerDu"
        label="Hva ønsker du å si?"
        htmlFor="hvaOnskerDu"
        isRequired
        type="textarea"
        register={register}
        error={errors.hvaOnskerDu?.message}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="glitch p-3 m-3 text-primaryButtonText transition duration-500 ease-in-out bg-emerald-700 rounded hover:shadow-outline hover:bg-emerald-800 disabled:opacity-50 disabled:pointer-events-none"
      >
        Send skjema
      </button>
    </form>
  );
};

export default Form;
