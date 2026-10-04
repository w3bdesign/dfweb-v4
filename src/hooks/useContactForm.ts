"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema, FormData } from "@/components/Kontakt/config/formConfig";

interface UseContactFormArgs {
  /**
   * Optional submit handler. When provided it replaces the default EmailJS
   * integration — this is the dependency-injection seam that makes the hook
   * (and the component that consumes it) easy to test.
   */
  onSubmit?: (data: FormData) => Promise<string>;
  /** Pre-populated server response, e.g. from a server-rendered submission. */
  initialResponse?: string;
}

/**
 * useContactForm — encapsulates all contact-form logic:
 * react-hook-form wiring, Zod validation, EmailJS submission and the
 * server-response state. Keeping this out of the component lets the form be a
 * purely presentational building block (Separation of Concerns / SRP) and lets
 * the submission logic be unit-tested in isolation.
 *
 * @param args.onSubmit Optional handler that overrides the default EmailJS path.
 * @param args.initialResponse Optional initial server response message.
 * @returns The react-hook-form API plus submission state and handler.
 */
export function useContactForm({
  onSubmit: onSubmitProp,
  initialResponse = "",
}: UseContactFormArgs = {}) {
  const [submittedResponse, setSubmittedResponse] = useState<string | null>(
    null,
  );
  const serverResponse = submittedResponse ?? initialResponse;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  /**
   * Default form submission handler using EmailJS.
   * Dynamically imports @emailjs/browser only when the user submits,
   * reducing the initial bundle size (Vercel React Best Practices Rule 2.2).
   */
  const defaultOnSubmit = async (data: FormData): Promise<string> => {
    const EMAIL_API_KEY = process.env.NEXT_PUBLIC_EMAIL_API_KEY ?? "changeme";
    const TEMPLATE_KEY =
      process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_KEY ?? "changeme";
    const SERVICE_KEY = process.env.NEXT_PUBLIC_EMAIL_SERVICE_KEY ?? "changeme";

    try {
      const emailjs = (await import("@emailjs/browser")).default;
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
    setSubmittedResponse(message);
  };

  return {
    register,
    handleSubmit,
    handleFormSubmit,
    errors,
    isSubmitting,
    serverResponse,
  };
}
