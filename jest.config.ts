import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config = {
  preset: "ts-jest/presets/js-with-babel-esm",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/src/e2e/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "^src/utils$": "<rootDir>/src/utils/__mocks__",
    "^src/utils/(.*)$": "<rootDir>/src/utils/$1",
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
