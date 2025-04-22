import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customJestConfig = {
  preset: "ts-jest/presets/js-with-babel-esm",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/src/e2e/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/components/*.{js,jsx,ts,tsx}",
    "!src/lib/**/*.*",
    "!src/pages/**/*.*",
    "!src/utils/**/*.*",
  ],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./test-results",
        outputName: "junit.xml",
      },
    ],
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
