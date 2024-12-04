"use client";

import React, { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorFallbackWrapper from "./ErrorFallbackWrapper.component";

interface ErrorBoundaryProps {
  children: ReactNode;
  compact?: boolean;
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in the child component tree.
 * It logs the error and displays a fallback UI instead of the component tree that crashed.
 *
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The child components to be wrapped by the ErrorBoundary
 * @param {boolean} props.compact - Whether to show a compact error fallback (used in stories)
 * @returns {JSX.Element} A React component that catches errors in its child components
 */
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, compact = false }) => {
  const handleError = (error: Error, info: { componentStack: string }) => {
    console.error("Uventet feil i Matrix:", error, info);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={({ error }) => <ErrorFallbackWrapper error={error} compact={compact} />}
      onError={handleError}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
