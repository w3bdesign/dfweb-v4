import React from "react";
import { FallbackProps } from "react-error-boundary";
import ErrorFallbackWrapper from "./ErrorFallbackWrapper.component";

interface FallbackComponentProps extends FallbackProps {
  compact: boolean;
}

const Fallback: React.FC<FallbackComponentProps> = ({ error, compact }) => {
  return <ErrorFallbackWrapper error={error} compact={compact} />;
};

export default Fallback;
