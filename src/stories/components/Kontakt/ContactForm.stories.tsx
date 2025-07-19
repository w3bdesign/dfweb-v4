import React from "react";
import { Meta } from "@ladle/react";
import ContactFormWithMocks from "./ContactFormWithMocks";
import "@/app/globals.css";

export default {
  title: "Kontakt/ContactForm",
  component: ContactFormWithMocks,
} as Meta;

// Default form view
export const Default = () => <ContactFormWithMocks />;

// Success response view
export const SuccessResponse = () => (
  <div className="bg-slate-800 min-h-screen py-16">
    <ContactFormWithMocks initialResponse="Takk for din beskjed" />
  </div>
);

// Error response view
export const ErrorResponse = () => (
  <div className="bg-slate-800 min-h-screen py-16">
    <ContactFormWithMocks initialResponse="Feil under sending av skjema" />
  </div>
);

// Simulated success on form submission
export const SubmissionSuccess = () => (
  <div className="bg-slate-800 min-h-screen py-16">
    <ContactFormWithMocks simulateError={false} />
    <div className="mt-8 text-center text-gray-400">
      <p>(Note: Fill in the form and submit to see a success message)</p>
    </div>
  </div>
);

// Simulated error on form submission
export const SubmissionError = () => (
  <div className="bg-slate-800 min-h-screen py-16">
    <ContactFormWithMocks simulateError={true} />
    <div className="mt-8 text-center text-gray-400">
      <p>(Note: Fill in the form and submit to see an error message)</p>
    </div>
  </div>
);

// Form in narrow container
export const NarrowContainer = () => (
  <div className="bg-slate-800 min-h-screen py-16">
    <div className="max-w-md mx-auto">
      <ContactFormWithMocks />
    </div>
  </div>
);
