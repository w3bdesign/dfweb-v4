"use client";

import { useEffect } from "react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="nb">
      <body className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-900 text-slate-300">
        <main className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-red-400">Noe gikk galt</h2>
          <p className="text-gray-300">
            Det oppsto en uventet feil. Vennligst prøv igjen.
          </p>
          {error.message && (
            <p className="text-sm text-gray-400 font-mono bg-slate-800 p-3 rounded">
              {error.message}
            </p>
          )}
          <button
            onClick={reset}
            className="px-6 py-3 bg-matrix-dark hover:bg-matrix-dark/80 text-white rounded-sm transition-colors"
          >
            Prøv igjen
          </button>
        </main>
      </body>
    </html>
  );
}
