"use client";

import React, { ReactNode, ErrorInfo, useCallback } from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps,
} from "react-error-boundary";
import Fallback from "./Fallback.component";

interface ErrorBoundaryProps {
  children: ReactNode;
  compact?: boolean;
}

const handleError = (error: Error, info: ErrorInfo) => {
  console.error("Uventet feil i Matrix:", error, info);
};

/**
 * ErrorBoundary component that catches JavaScript errors anywhere in the child component tree.
 * It logs the error and displays a fallback UI instead of the component tree that crashed.
 *
 * Uses fallbackRender instead of FallbackComponent to avoid defining a component inside
 * a component (Vercel React Best Practices Rule 5.4), which would cause remounts on every render.
 *
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The child components to be wrapped by the ErrorBoundary
 * @param {boolean} props.compact - Whether to show a compact error fallback (used in stories)
 * @returns {JSX.Element} A React component that catches errors in its child components
 */
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  compact = false,
}) => {
  const renderFallback = useCallback(
    (props: FallbackProps) => <Fallback {...props} compact={compact} />,
    [compact],
  );

  return (
    <ReactErrorBoundary fallbackRender={renderFallback} onError={handleError}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
