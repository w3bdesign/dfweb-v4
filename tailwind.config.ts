import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // New Modern Color Scheme
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        text: "var(--text)",
        background: "var(--background)",

        // Semantic Colors
        success: "#00cc4e",
        error: "#ff4e4e",
        warning: "#ffb74e",
        info: "#4e9fff",

        // Surface Colors
        surface: {
          light: "rgba(255, 255, 255, 0.05)",
          DEFAULT: "rgba(26, 26, 26, 0.8)",
          dark: "rgba(0, 0, 0, 0.8)",
        },

        // Matrix Theme Colors
        matrix: {
          light: "#00ff62",
          DEFAULT: "#00cc4e",
          dark: "#008529",
          glow: "rgba(0, 255, 98, 0.6)",
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(0, 255, 98, 0.6)',
        'glow-sm': '0 0 10px rgba(0, 255, 98, 0.4)',
        'glow-lg': '0 0 20px rgba(0, 255, 98, 0.8)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'matrix-fade': 'matrixFade 2s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'matrix-glow': 'matrixGlow 2s ease-in-out infinite',
      },
      keyframes: {
        matrixFade: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 255, 98, 0.6)' },
          '50%': { boxShadow: '0 0 25px rgba(0, 255, 98, 0.8)' },
        },
        matrixGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(0, 255, 98, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 15px rgba(0, 255, 98, 0.8))' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--text)',
            a: {
              color: 'var(--secondary)',
              '&:hover': {
                color: 'var(--accent)',
              },
            },
            h1: {
              color: 'var(--accent)',
            },
            h2: {
              color: 'var(--secondary)',
            },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
