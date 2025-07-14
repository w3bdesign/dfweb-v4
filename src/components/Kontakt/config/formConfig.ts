import { z } from "zod";

/** Zod schema for contact form */
export const contactSchema = z.object({
  navn: z
    .string()
    .min(1, "Fullt navn er påkrevd")
    .regex(/^[a-zA-ZæøåÆØÅ ]+$/, "Vennligst bruk norske bokstaver"),
  telefon: z
    .string()
    .min(1, "Telefonnummer er påkrevd")
    .regex(/^\d{8}$/, "Vennligst oppgi et gyldig telefonnummer"),
  tekst: z.string().min(1, "Beskjed er påkrevd"),
});

/** Type inferred from schema */
export type ContactFormData = z.infer<typeof contactSchema>;

/** Simple field config for rendering the form */
export const contactFields = [
  {
    name: "navn",
    label: "Fullt navn",
    type: "input",
    pattern: /^[a-zA-ZæøåÆØÅ ]+$/,
    validationMessage: "Vennligst bruk norske bokstaver",
  },
  {
    name: "telefon",
    label: "Telefonnummer",
    type: "input",
    pattern: /^\d{8}$/,
    validationMessage: "Vennligst oppgi et gyldig telefonnummer",
  },
  {
    name: "tekst",
    label: "Hva ønsker du å si?",
    type: "textarea",
  },
];
