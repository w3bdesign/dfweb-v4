'use client';

import React, { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import ReactMatrixAnimation from "@/components/Animations/Matrix.component";

interface ErrorFallbackProps {
  error: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <div className="absolute w-full h-full">
      <ReactMatrixAnimation />
      <div className="absolute inset-0 flex flex-col items-center justify-center h-full">
        <h1 className="text-red-500 text-5xl m-6">Oops! Something went wrong.</h1>
        <p className="text-white text-xl mb-6">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={(error, info) => {
      console.error("Uncaught error:", error, info);
    }}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;