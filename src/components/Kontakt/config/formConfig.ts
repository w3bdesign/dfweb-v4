import { z } from "zod";

export const formSchema = z.object({
  navn: z
    .string()
    .min(1, { error: "Fullt navn er påkrevd" })
    .regex(/^[a-zA-ZæøåÆØÅ ]+$/, { error: "Vennligst bruk norske bokstaver" }),
  telefon: z
    .string()
    .min(1, { error: "Telefonnummer er påkrevd" })
    .regex(/^\d{8}$/, { error: "Vennligst oppgi et gyldig telefonnummer" }),
  tekst: z.string().min(1, { error: "Beskjed er påkrevd" }),
});

export type FormData = z.infer<typeof formSchema>;

export const formFields = [
  {
    name: "navn" as const,
    label: "Fullt navn",
    inputPattern: /^[a-zA-ZæøåÆØÅ ]+$/,
    title: "Vennligst bruk norske bokstaver",
  },
  {
    name: "telefon" as const,
    label: "Telefonnummer",
    inputPattern: /^\d{8}$/,
    title: "Vennligst oppgi et gyldig telefonnummer",
  },
  {
    name: "tekst" as const,
    label: "Hva ønsker du å si?",
    type: "textarea" as const,
  },
] as const;
