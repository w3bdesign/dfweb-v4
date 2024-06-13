

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // Primary Colors
        background: "#e5e7eb", // Main background color
        navbar: "#ffffff", // Navbar background color
        matrixRain: "#000000", // Matrix rain effect background color
        footer: "#1f2937", // Footer background color

        // Accent Colors
        primaryAccent: "#00ff00", // Primary accent (Matrix Green)
        secondaryAccent: "#008000", // Secondary accent (Dark Green)
        highlight: "#00cc00", // Highlight/Link color

        // Text Colors
        primaryText: "#1f2937", // Primary text color
        secondaryText: "#4b5563", // Secondary text color
        lightText: "#ffffff", // Light text color

        // Button Colors
        primaryButtonBg: "#008F11", // Primary button background color
        primaryButtonText: "#fff", // Primary button text color
        secondaryButtonBg: "#003B00", // Secondary button background color
        secondaryButtonText: "#ffffff", // Secondary button text color
      },
    },
  },
  plugins: [],
};

export default config;

