import React from "react";
import { Meta } from "@ladle/react";
import KontaktWithMocks from "./KontaktWithMocks";
import "@/app/globals.css";

export default {
  title: "Kontakt/KontaktContent",
  component: KontaktWithMocks,
} as Meta;

// Default form view
export const Default = () => <KontaktWithMocks />;

// Success response view
export const SuccessResponse = () => (
  <div className="bg-slate-800 min-h-screen py-16">
    <KontaktWithMocks initialResponse="Takk for din beskjed" />
  </div>
);

// Error response view
export const ErrorResponse = () => (
  <div className="bg-slate-800 min-h-screen py-16">
    <KontaktWithMocks initialResponse="Feil under sending av skjema" />
  </div>
);

// Simulated success on form submission
export const SubmissionSuccess = () => (
  <div className="bg-slate-800 min-h-screen py-16">
    <KontaktWithMocks simulateError={false} />
    <div className="mt-8 text-center text-gray-400">
      <p>(Note: Fill in the form and submit to see a success message)</p>
    </div>
  </div>
);

// Simulated error on form submission
export const SubmissionError = () => (
  <div className="bg-slate-800 min-h-screen py-16">
    <KontaktWithMocks simulateError={true} />
    <div className="mt-8 text-center text-gray-400">
      <p>(Note: Fill in the form and submit to see an error message)</p>
    </div>
  </div>
);

// Form in narrow container
export const NarrowContainer = () => (
  <div className="bg-slate-800 min-h-screen py-16">
    <div className="max-w-md mx-auto">
      <KontaktWithMocks />
    </div>
  </div>
);
