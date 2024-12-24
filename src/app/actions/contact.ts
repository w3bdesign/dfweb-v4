"use server";

import emailjs from "@emailjs/browser";
import { z } from "zod";
import { formSchema } from "@/components/Kontakt/config/formConfig";

type FormResponse = {
  success: boolean;
  message: string;
};

/**
 * Server action to handle contact form submission
 * Uses EmailJS to send emails with provided form data
 */
export async function handleContactForm(
  formData: z.infer<typeof formSchema>
): Promise<FormResponse> {
  const EMAIL_API_KEY = process.env.NEXT_PUBLIC_EMAIL_API_KEY ?? "changeme";
  const TEMPLATE_KEY = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_KEY ?? "changeme";
  const SERVICE_KEY = process.env.NEXT_PUBLIC_EMAIL_SERVICE_KEY ?? "changeme";

  try {
    // Validate form data server-side
    const validatedData = formSchema.parse(formData);

    // Initialize and send email
    emailjs.init(EMAIL_API_KEY);
    await emailjs.send(SERVICE_KEY, TEMPLATE_KEY, validatedData);

    return {
      success: true,
      message: "Takk for din beskjed",
    };
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Ugyldig skjemadata",
      };
    }

    // Handle other errors
    return {
      success: false,
      message: "Feil under sending av skjema",
    };
  }
}
