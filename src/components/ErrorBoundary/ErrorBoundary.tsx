"use client";

import React, { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback.component";

interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in the child component tree.
 * It logs the error and displays a fallback UI instead of the component tree that crashed.
 *
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The child components to be wrapped by the ErrorBoundary
 * @returns {JSX.Element} A React component that catches errors in its child components
 */
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("Uventet feil i Matrix:", error, info);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
