import React from "react";
import ReactMatrixAnimation from "@/components/Animations/Matrix.component";
import Pill from "@/components/UI/Pill.component";

interface ErrorFallbackProps {
  error: Error;
}

/**
 * ErrorFallback component to display when an error occurs within the ErrorBoundary.
 * It shows a Matrix-themed error message with the option to reload the page.
 *
 * @param {Object} props - The component props
 * @param {Error} props.error - The error object caught by the ErrorBoundary
 * @returns {JSX.Element} A React component displaying the error message and reload option
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
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
          href="/"
          text="Returner til Matrix"
          onClick={() => window.location.reload()}
        />
      </div>
    </div>
  );
};

export default ErrorFallback;
