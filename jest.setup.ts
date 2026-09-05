/// <reference types="jest" />
import "@testing-library/jest-dom";
import "jest-extended";
import { checkAAAPattern } from "./src/utils/test-utils";
import fs from "node:fs/promises";
import path from "node:path";

// Mock matchMedia for prefers-reduced-motion and other media queries
Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

declare global {
  namespace jest {
    interface Matchers<R> {
      // Testing Library matchers
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveStyle(css: Record<string, unknown>): R;
      toContainElement(element: Element | null): R;
      toContainHTML(html: string): R;
      toHaveLength(length: number): R;

      // Jest matchers
      toBe(expected: unknown): R;
      toEqual(expected: unknown): R;
      toStrictEqual(expected: unknown): R;
      toBeNull(): R;
      toBeDefined(): R;
      toBeUndefined(): R;
      toBeTruthy(): R;
      toBeFalsy(): R;
      toBeGreaterThan(number: number): R;
      toBeLessThan(number: number): R;
      toBeLessThanOrEqual(number: number): R;
      toBeGreaterThanOrEqual(number: number): R;
      toContain(item: unknown): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledTimes(number: number): R;
      toHaveBeenCalledWith(...args: unknown[]): R;
      toHaveBeenCalledExactly(times: number): R;
      toThrow(error?: string | Error | RegExp): R;
      toMatch(regexpOrString: string | RegExp): R;
      rejects: {
        toThrow(error?: string | Error | RegExp): Promise<R>;
      };
    }
  }
}

function getTestPath(): string | undefined {
  return (
    expect as unknown as { getState: () => { testPath?: string } }
  ).getState().testPath;
}

// Test files that should never be checked for the AAA pattern
const AAA_EXEMPT_PATTERNS = ["test-rule.test.tsx", "node_modules"];

// Windows and POSIX path separator variants for the test directory
const TEST_DIR_PREFIXES = ["src/__tests__/", "src\\__tests__\\"];

const TEST_FILE_SUFFIXES = [".test.ts", ".test.tsx", ".spec.ts", ".spec.tsx"];

/**
 * Validates that a test file path is safe to read.
 * Prevents path traversal attacks by ensuring the path is within the project directory
 * and is actually a test file.
 */
function isValidTestPath(testPath: string): boolean {
  // Resolve to absolute path to eliminate ../ sequences
  const resolvedPath = path.resolve(testPath);
  const projectRoot = path.resolve(__dirname);

  // Must be within project directory
  if (!resolvedPath.startsWith(projectRoot)) {
    return false;
  }

  const relativePath = path.relative(projectRoot, resolvedPath);
  const isInTestDir = TEST_DIR_PREFIXES.some((prefix) =>
    relativePath.startsWith(prefix),
  );
  const isTestFile = TEST_FILE_SUFFIXES.some((suffix) =>
    resolvedPath.endsWith(suffix),
  );

  return isInTestDir && isTestFile;
}

function shouldValidateAAA(testPath: string | undefined): testPath is string {
  if (!testPath) {
    return false;
  }
  return !AAA_EXEMPT_PATTERNS.some((pattern) => testPath.includes(pattern));
}

async function assertAAAPattern(testPath: string): Promise<void> {
  const content = await fs.readFile(testPath, "utf8");
  const result = checkAAAPattern(content);

  if (result.isValid) {
    return;
  }

  throw new Error(
    `Test file is missing required AAA comments: ${result.missingComments.join(", ")}\n` +
      "Each test should include:\n" +
      "// Arrange - Set up test data and conditions\n" +
      "// Act - Perform the action being tested\n" +
      "// Assert - Verify the results",
  );
}

function toValidationError(error: unknown): unknown {
  if (error instanceof Error) {
    return new Error(`Failed to validate AAA pattern: ${error.message}`);
  }
  return error;
}

beforeEach(async () => {
  const testPath = getTestPath();

  if (!shouldValidateAAA(testPath)) {
    return;
  }

  // Validate path before reading to prevent path traversal attacks
  if (!isValidTestPath(testPath)) {
    console.warn(`Skipping AAA validation for invalid test path: ${testPath}`);
    return;
  }

  try {
    await assertAAAPattern(testPath);
  } catch (error) {
    throw toValidationError(error);
  }
});
