import "@testing-library/jest-dom";
import "jest-extended";
import { checkAAAPattern } from "./src/utils/test-utils";

beforeEach(() => {
  const stack = new Error().stack || '';
  const testPath = expect.getState().testPath as string;
  
  // Use a more specific regex pattern with limits to prevent ReDoS
  // - ^ anchors to start of line
  // - [^\n]{0,1000} limits line length
  // - (?:\s{1,4}at\s) matches "at" with limited whitespace
  // - ([^\s\n]{1,100}) captures the function name with length limit
  const testName = stack.split('\n')[2]?.match(/^[^\n]{0,1000}(?:\s{1,4}at\s)([^\s\n]{1,100})/)?.[1] || '';
  
  // Skip this check for test-rule.test.tsx since it contains intentionally invalid tests
  if (!testPath.includes('test-rule.test.tsx') && !testName.includes('node_modules')) {
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
