/** @type {import('ts-jest').JestConfigWithTsJest} */
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./"
});

// Add any custom config to be passed to Jest
const customJestConfig: {
  preset: string;
  setupFilesAfterEnv: string[];
  testPathIgnorePatterns: string[];
  testEnvironment: string;
  collectCoverageFrom: string[];
} = {
  preset: "ts-jest/presets/js-with-babel-esm",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["<rootDir>/cypress/", "<rootDir>/playwright/"],
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: [
    "src/components/*.{js,jsx,ts,tsx}",
    "!src/lib/**/*.*",
    "!src/pages/**/*.*",
    "!src/utils/**/*.*"
  ]
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
