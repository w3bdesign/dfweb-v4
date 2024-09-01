"use client";

import React, { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ReactMatrixAnimation from "@/components/Animations/Matrix.component";
import Pill from "@/components/UI/Pill.component";

interface ErrorFallbackProps {
  error: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <div className="absolute w-full h-full">
      <ReactMatrixAnimation />
      <div className="absolute inset-0 flex flex-col items-center justify-center h-full">
        <h1 className="text-white text-5xl m-6">
          Har du funnet en feil i Matrix, Neo?
        </h1>
        <p className="text-white text-xl mb-6">
          {error.message || "En uventet feil har oppstått."}
        </p>
        <Pill
          href="/"
          text="Returner til Matrix"
          onClick={() => window.location.reload()}
        />
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: ReactNode;
}

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
