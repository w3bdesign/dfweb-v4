import "@testing-library/jest-dom";
import "jest-extended";
import { checkAAAPattern } from "./src/utils/test-utils";

beforeEach(() => {
  const stack = new Error().stack || '';
  
  // Get the test file path from the stack trace
  const testFileLine = stack.split('\n').find(line => line.includes('__tests__'));
  const testPath = testFileLine?.match(/\((.+?):\d+/)?.[1] || '';
  
  // Skip this check for test-rule.test.tsx since it contains intentionally invalid tests
  if (!testPath.includes('test-rule.test.tsx') && !testPath.includes('node_modules')) {
    const fs = require('fs');
    const content = fs.readFileSync(testPath, 'utf8');
    const result = checkAAAPattern(content);
    
    if (!result.isValid) {
      throw new Error(
        `Test file is missing required AAA comments: ${result.missingComments.join(', ')}\n` +
        'Each test should include:\n' +
        '// Arrange - Set up test data and conditions\n' +
        '// Act - Perform the action being tested\n' +
        '// Assert - Verify the results'
      );
    }
  }
});

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
