'use client';

import React, { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface ErrorFallbackProps {
  error: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <div className="text-center py-10" role="alert">
      <h2 className="text-2xl font-bold text-red-500">Oops! Something went wrong.</h2>
      <p className="mt-2 text-gray-600">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Page
      </button>
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