import "@testing-library/jest-dom/vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { beforeEach, expect, vi } from "vitest";
import { checkAAAPattern } from "./src/utils/test-utils";

// Mock matchMedia for prefers-reduced-motion and other media queries
Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// jsdom has no AnimationEvent. Without it, React picks the event name for onAnimationEnd by
// vendor detection, and jsdom 31 exposes WebkitAnimation, so React listens for
// "webkitAnimationEnd" while fireEvent.animationEnd dispatches "animationend". Browsers have
// AnimationEvent, so this minimal stand-in restores browser behaviour. It must exist before
// react-dom loads, which setup files guarantee.
if (typeof window !== "undefined" && !("AnimationEvent" in window)) {
  class AnimationEventPolyfill extends Event {
    readonly animationName: string;
    readonly elapsedTime: number;
    readonly pseudoElement: string;

    constructor(type: string, init: AnimationEventInit = {}) {
      super(type, init);
      this.animationName = init.animationName ?? "";
      this.elapsedTime = init.elapsedTime ?? 0;
      this.pseudoElement = init.pseudoElement ?? "";
    }
  }
  Object.defineProperty(window, "AnimationEvent", {
    writable: true,
    configurable: true,
    value: AnimationEventPolyfill,
  });
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
  const projectRoot = path.resolve(import.meta.dirname);

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
  const testPath = expect.getState().testPath;

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
