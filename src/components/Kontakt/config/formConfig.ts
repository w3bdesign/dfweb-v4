import { z } from "zod";

export const formSchema = z.object({
  navn: z
    .string()
    .min(1, "Fullt navn er påkrevd")
    .min(2, "Navn må være minst 2 tegn")
    .max(100, "Navn kan ikke være mer enn 100 tegn")
    .regex(/^[a-zA-ZæøåÆØÅ ]+$/, "Vennligst bruk norske bokstaver"),
  telefon: z
    .string()
    .min(1, "Telefonnummer er påkrevd")
    .regex(/^\d{8}$/, "Vennligst oppgi et gyldig telefonnummer"),
  tekst: z
    .string()
    .min(1, "Beskjed er påkrevd")
    .min(10, "Beskjed må være minst 10 tegn")
    .max(1000, "Beskjed kan ikke være mer enn 1000 tegn"),
});

export type FormData = z.infer<typeof formSchema>;
