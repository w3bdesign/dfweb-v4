import React from "react";
import ContactForm from "@/components/Kontakt/ContactForm.component";
import { FormData } from "@/components/Kontakt/config/formConfig";

/**
 * Props for the ContactFormWithMocks story.
 */
type StoryProps = {
  simulateError?: boolean;
  initialResponse?: string;
};

/**
 * A special version of ContactForm for stories.
 * This renders the actual ContactForm component but provides a mock
 * onSubmit handler to prevent real email submissions and simulate responses.
 */
const ContactFormWithMocks: React.FC<StoryProps> = ({
  simulateError = false,
  initialResponse = "",
}) => {
  /**
   * Simulated form submission that doesn't make any actual API calls.
   * It returns a promise that resolves to a message string, which ContactForm will use.
   */
  const mockOnSubmit = async (data: FormData): Promise<string> => {
    console.warn("Story mock: Form submitted with data:", data);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (simulateError) {
      return "Feil under sending av skjema"; // Story mock: Simulate error
    } else {
      return "Takk for din beskjed"; // Story mock: Simulate success
    }
  };

  return (
    <ContactForm onSubmit={mockOnSubmit} initialResponse={initialResponse} />
  );
};

export default ContactFormWithMocks;