import { z } from "zod";

export const formSchema = z.object({
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

export type FormData = z.infer<typeof formSchema>;
