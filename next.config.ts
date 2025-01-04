import type { NextConfig } from "next";

const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https://va.vercel-scripts.com"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "blob:", "data:", "https://cdn.sanity.io"],
  'font-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'connect-src': ["'self'", "https://api.emailjs.com", "https://va.vercel-scripts.com"],
};

const buildCspHeader = (directives: Record<string, string[]>) => 
  Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')};`)
    .join(' ') + ' upgrade-insecure-requests;';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Content-Security-Policy", value: buildCspHeader(cspDirectives) },
      ],
    }];
  },
};

export default nextConfig;
