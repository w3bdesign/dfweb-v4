"use client";

import { useEffect } from "react";

type ErrorBoundaryProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <h2 className="text-2xl font-bold text-matrix-light mb-4">
        Noe gikk galt ved lasting av prosjekter
      </h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-matrix-dark hover:bg-matrix-light text-white rounded-sm transition-colors"
      >
        Prøv igjen
      </button>
    </div>
  );
}
