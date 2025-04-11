import React from "react";

import ReactMatrixAnimation from "../../components/Animations/Matrix.component";
import Pill from "../../components/UI/Pill.component";

interface ErrorFallbackProps {
  error: Error;
  compact?: boolean;
}

/**
 * ErrorFallback component to display when an error occurs within the ErrorBoundary.
 * It shows a Matrix-themed error message with the option to reload the page.
 *
 * @param {Object} props - The component props
 * @param {Error} props.error - The error object caught by the ErrorBoundary
 * @param {boolean} props.compact - Whether to show a compact version (used in stories)
 * @returns {JSX.Element} A React component displaying the error message and reload option
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="relative bg-gray-900 p-4 rounded-lg overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <ReactMatrixAnimation />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-white text-lg mb-2">
            Har du funnet en feil i Matrix?
          </h2>
          <p className="text-white text-sm mb-3">
            {error.message || "En uventet feil har oppstått."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-matrix-light text-black rounded text-sm hover:bg-matrix-dark"
          >
            Returner til Matrix
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute w-full h-full">
      <ReactMatrixAnimation />
      <div className="absolute inset-0 flex flex-col items-center justify-center h-full">
        <h1 className="text-white text-5xl m-6">
          Har du funnet en feil i Matrix?
        </h1>
        <p className="text-white text-xl mb-6">
          {error.message || "En uventet feil har oppstått."}
        </p>
        <Pill
          text="Returner til Matrix"
          onClick={() => window.location.reload()}
        />
      </div>
    </div>
  );
};

export default ErrorFallback;
