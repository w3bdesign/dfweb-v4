import React from "react";
import { NextRouter } from "next/router";
import ErrorFallback from "./ErrorFallback.component";

interface ErrorFallbackWrapperProps {
  error: Error;
  compact?: boolean;
  router?: NextRouter;
}

/**
 * Wrapper component for ErrorFallback that handles compact mode
 * @param {Object} props - The component props
 * @param {Error} props.error - The error object to display
 * @param {boolean} props.compact - Whether to show a compact version
 * @returns {JSX.Element} The wrapped ErrorFallback component
 */
const ErrorFallbackWrapper: React.FC<ErrorFallbackWrapperProps> = ({
  error,
  compact,
  router,
}) => <ErrorFallback error={error} compact={compact} router={router} />;

export default ErrorFallbackWrapper;
