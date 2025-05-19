/**
 * Mock for process.env variables in environments like Ladle
 * where process.env might not be available
 */

// Define the proper TypeScript types
interface ProcessEnv {
  [key: string]: string | undefined;
}

interface Process {
  env: ProcessEnv;
}

// Only add the mock if process is undefined
if (typeof window !== "undefined" && typeof process === "undefined") {
  (window as Window & { process?: Process }).process = {
    env: {
      NODE_ENV: "development",
      NEXT_PUBLIC_EMAIL_API_KEY: "mock-email-api-key",
      NEXT_PUBLIC_EMAIL_TEMPLATE_KEY: "mock-template-key",
      NEXT_PUBLIC_EMAIL_SERVICE_KEY: "mock-service-key",
    },
  };
}

export {};
