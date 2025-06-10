import React from "react";
// Assuming @/ resolves to src/ as seen in KontaktContent.component.tsx
import KontaktContent from "@/components/Kontakt/KontaktContent.component";
import { FormData } from "@/components/Kontakt/config/formConfig";

/**
 * Props for the KontaktWithMocks story.
 */
type StoryProps = {
  simulateError?: boolean;
  initialResponse?: string;
};

/**
 * A special version of KontaktContent for stories.
 * This renders the actual KontaktContent component but provides a mock
 * onSubmit handler to prevent real email submissions and simulate responses.
 */
const KontaktWithMocks: React.FC<StoryProps> = ({
  simulateError = false,
  initialResponse = "",
}) => {
  /**
   * Simulated form submission that doesn't make any actual API calls.
   * It returns a promise that resolves to a message string, which KontaktContent will use.
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
    <KontaktContent onSubmit={mockOnSubmit} initialResponse={initialResponse} />
  );
};

export default KontaktWithMocks;
