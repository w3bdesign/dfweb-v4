import React from "react";
import { Meta } from "@ladle/react";
import Fallback from "@/components/ErrorBoundary/Fallback.component";
import "@/app/globals.css";

export default {
  title: "ErrorHandling/Fallback",
  component: Fallback,
} as Meta;

// Create mock FallbackProps from react-error-boundary
const createFallbackProps = (errorMessage: string) => ({
  error: new Error(errorMessage),
  resetErrorBoundary: () => console.log("Error boundary reset requested"),
});

// Default fallback (non-compact)
export const Default = () => (
  <Fallback {...createFallbackProps("An error occurred")} compact={false} />
);

// Compact fallback
export const Compact = () => (
  <Fallback {...createFallbackProps("An error occurred")} compact={true} />
);

// Fallback with a long error message
export const LongErrorMessage = () => (
  <Fallback 
    {...createFallbackProps(
      "This is a much longer error message that demonstrates how the component handles extensive text content. It might wrap to multiple lines and test the layout capabilities of the error display."
    )} 
    compact={false}
  />
);

// Compact fallback with a long error message
export const CompactLongErrorMessage = () => (
  <Fallback 
    {...createFallbackProps(
      "This is a much longer error message that demonstrates how the component handles extensive text content. It might wrap to multiple lines and test the layout capabilities of the error display."
    )} 
    compact={true}
  />
);

// Multiple compact fallbacks in a grid layout
export const MultipleFallbacks = () => (
  <div className="grid grid-cols-2 gap-4">
    <Fallback {...createFallbackProps("Network error")} compact={true} />
    <Fallback {...createFallbackProps("Authentication failed")} compact={true} />
    <Fallback {...createFallbackProps("Resource not found")} compact={true} />
    <Fallback {...createFallbackProps("Server error")} compact={true} />
  </div>
);
