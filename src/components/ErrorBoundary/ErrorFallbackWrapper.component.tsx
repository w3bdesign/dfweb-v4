import React from "react";
import ErrorFallback from "./ErrorFallback.component";

interface ErrorFallbackWrapperProps {
  error: Error;
  compact?: boolean;
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
}) => <ErrorFallback error={error} compact={compact} />;

export default ErrorFallbackWrapper;
