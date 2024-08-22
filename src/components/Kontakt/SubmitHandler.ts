import emailjs from "@emailjs/browser";

import { FormData } from "./FormSchema";

export const handleSubmit = async (data: FormData): Promise<void> => {
  const EMAIL_API_KEY = process.env.NEXT_PUBLIC_EMAIL_API_KEY ?? "changeme";
  const TEMPLATE_KEY = process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_KEY ?? "changeme";
  const SERVICE_KEY = process.env.NEXT_PUBLIC_EMAIL_SERVICE_KEY ?? "changeme";

  emailjs.init(EMAIL_API_KEY);
  await emailjs.send(SERVICE_KEY, TEMPLATE_KEY, data);
};