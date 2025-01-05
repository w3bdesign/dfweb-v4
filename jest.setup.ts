/// <reference types="jest" />
import "@testing-library/jest-dom";
import "jest-extended";
import { checkAAAPattern } from "./src/utils/test-utils";
import path from "path";
import fs from "fs/promises";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveBeenCalledExactly(times: number): R;
    }
  }
}

// Safely access Jest's internal state
function getTestPath(): string | undefined {
  // Using a type assertion since we know Jest's internal structure
  return (expect as any).getState().testPath;
}

beforeEach(async () => {
  const testPath = getTestPath();

  // Skip this check for test-rule.test.tsx since it contains intentionally invalid tests
  // Also skip if we can't determine the test path
  if (
    testPath &&
    !testPath.includes("test-rule.test.tsx") &&
    !testPath.includes("node_modules")
  ) {
    try {
      const content = await fs.readFile(testPath, "utf8");
      const result = checkAAAPattern(content);

      if (!result.isValid) {
        throw new Error(
          `Test file is missing required AAA comments: ${result.missingComments.join(", ")}\n` +
            "Each test should include:\n" +
            "// Arrange - Set up test data and conditions\n" +
            "// Act - Perform the action being tested\n" +
            "// Assert - Verify the results"
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to validate AAA pattern: ${error.message}`);
      }
      throw error;
    }
  }
});
