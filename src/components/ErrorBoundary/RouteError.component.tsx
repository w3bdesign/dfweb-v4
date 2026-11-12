"use client";

import { useEffect } from "react";

interface RouteErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
  readonly description: string;
}

/**
 * Shared error UI for Next.js route segment `error.tsx` files.
 * Logs the error, shows a description and the error message, and offers a retry.
 * @param {RouteErrorProps} props - The error, the reset callback and the description
 * @returns {JSX.Element} The rendered error state
 */
const RouteError = ({ error, reset, description }: RouteErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold text-red-400">Noe gikk galt</h2>
        <p className="text-gray-300">{description}</p>
        {error.message && (
          <p className="text-sm text-gray-400 font-mono bg-slate-800 p-3 rounded">
            {error.message}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 bg-matrix-dark hover:bg-matrix-dark/80 text-white rounded-sm transition-colors"
        >
          Prøv igjen
        </button>
      </div>
    </main>
  );
};

export default RouteError;
