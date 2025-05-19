import React from "react";
import { Meta } from "@ladle/react";
import ErrorFallback from "@/components/ErrorBoundary/ErrorFallback.component";
import "@/app/globals.css";

export default {
  title: "ErrorHandling/ErrorFallback",
  component: ErrorFallback,
} as Meta;

// Create a mock error to pass to the component
const mockError = new Error("This is a test error message");

// Default full-screen error fallback
export const Default = () => (
  <div className="relative mx-auto my-8 p-4 bg-gray-800 rounded-lg shadow-xl" style={{ maxWidth: '800px', height: '600px', overflow: 'hidden' }}>
    <ErrorFallback error={mockError} />
  </div>
);

// Compact error fallback for inline use
export const Compact = () => <ErrorFallback error={mockError} compact={true} />;

// Error with a long message
export const LongErrorMessage = () => (
  <div className="relative mx-auto my-8 p-4 bg-gray-800 rounded-lg shadow-xl" style={{ maxWidth: '800px', height: '600px', overflow: 'hidden' }}>
    <ErrorFallback 
      error={new Error(
        "This is a much longer error message that demonstrates how the component handles extensive text content. It might wrap to multiple lines and test the layout capabilities of the error display."
      )} 
    />
  </div>
);

// Compact error with a long message
export const CompactLongErrorMessage = () => (
  <ErrorFallback 
    error={new Error(
      "This is a much longer error message that demonstrates how the component handles extensive text content. It might wrap to multiple lines and test the layout capabilities of the error display."
    )}
    compact={true} 
  />
);

// Error without a specific message
export const NoMessageError = () => (
  <div className="relative mx-auto my-8 p-4 bg-gray-800 rounded-lg shadow-xl" style={{ maxWidth: '800px', height: '600px', overflow: 'hidden' }}>
    <ErrorFallback error={new Error()} />
  </div>
);

// Multiple compact errors side by side
export const MultipleCompactErrors = () => (
  <div className="grid grid-cols-2 gap-4">
    <ErrorFallback error={new Error("Database connection failed")} compact={true} />
    <ErrorFallback error={new Error("API request timeout")} compact={true} />
    <ErrorFallback error={new Error("Authentication error")} compact={true} />
    <ErrorFallback error={new Error("Permission denied")} compact={true} />
  </div>
);
