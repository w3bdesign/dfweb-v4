import React from "react";
import { FallbackProps } from "react-error-boundary";
import { NextRouter } from "next/router";

import ErrorFallbackWrapper from "./ErrorFallbackWrapper.component";

interface FallbackComponentProps extends FallbackProps {
  compact: boolean;
  router?: NextRouter;
}

const Fallback: React.FC<FallbackComponentProps> = ({
  error,
  compact,
  router,
}) => {
  return (
    <ErrorFallbackWrapper error={error} compact={compact} router={router} />
  );
};

export default Fallback;
