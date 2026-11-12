"use client";

import RouteError from "@/components/ErrorBoundary/RouteError.component";

type ErrorBoundaryProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <RouteError
      error={error}
      reset={reset}
      description="Det oppsto en feil under lasting av CV-siden."
    />
  );
}
