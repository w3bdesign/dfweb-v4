// @ts-check
// Native ESM avoids ts-node's dependency on the pre-TypeScript 7 compiler API.
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

// next/jest supplies SWC transforms for both application and test TypeScript.
/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/src/e2e/"],
  testEnvironment: "jest-environment-jsdom",
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@portabletext/react$": "<rootDir>/src/__mocks__/portabletext-react.tsx",
    "@/(.*)": "<rootDir>/src/$1",
    "^src/utils$": "<rootDir>/src/__mocks__/utils",
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/components/*.{js,jsx,ts,tsx}",
    "!src/lib/**/*.*",
    "!src/pages/**/*.*",
    "!src/utils/**/*.*",
  ],
};

export default createJestConfig(customJestConfig);
