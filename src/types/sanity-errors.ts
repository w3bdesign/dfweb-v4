export interface SanityApiError {
  statusCode: number;
  message: string;
  details?: {
    type: string;
    description: string;
  };
}

export function isSanityApiError(error: unknown): error is SanityApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    "message" in error &&
    typeof (error as SanityApiError).statusCode === "number" &&
    typeof (error as SanityApiError).message === "string"
  );
}
