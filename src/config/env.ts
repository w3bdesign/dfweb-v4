import { cleanEnv, str } from "envalid";

// Server-side environment variables
export const serverEnv = cleanEnv(process.env, {
  AI_API_KEY: str({
    desc: "AI service API key",
  }),
  AI_BASE_URL: str({
    desc: "AI service base URL",
  }),
  MODEL_NAME: str({
    desc: "AI model identifier",
    default: "claude-3.7-sonnet@anthropic",
  }),
});

// Client-side environment variables (NEXT_PUBLIC_)
export const publicEnv = cleanEnv(process.env, {
  NEXT_PUBLIC_EMAIL_API_KEY: str({
    desc: 'EmailJS API key starting with "user_"',
    example: "user_abc123",
  }),
  NEXT_PUBLIC_EMAIL_TEMPLATE_KEY: str({
    desc: 'EmailJS template key starting with "template_"',
    example: "template_xyz789",
  }),
  NEXT_PUBLIC_EMAIL_SERVICE_KEY: str({
    desc: 'EmailJS service key starting with "service_"',
    example: "service_def456",
  }),
});

// Type-safe way to access public env vars from the client
export const clientEnv = {
  EMAIL_API_KEY: publicEnv.NEXT_PUBLIC_EMAIL_API_KEY,
  EMAIL_TEMPLATE_KEY: publicEnv.NEXT_PUBLIC_EMAIL_TEMPLATE_KEY,
  EMAIL_SERVICE_KEY: publicEnv.NEXT_PUBLIC_EMAIL_SERVICE_KEY,
};
