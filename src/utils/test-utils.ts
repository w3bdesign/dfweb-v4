const REQUIRED_AAA_COMMENTS = ["Arrange", "Act", "Assert"] as const;

/**
 * Helper function to check if a test follows the AAA pattern
 * @param testContent The content of the test to check
 * @returns Object containing check results
 */
export const checkAAAPattern = (testContent: string) => {
  const hasComment = (label: string) => testContent.includes(`// ${label}`);
  const missingComments = REQUIRED_AAA_COMMENTS.filter(
    (label) => !hasComment(label),
  );

  return {
    hasArrange: hasComment("Arrange"),
    hasAct: hasComment("Act"),
    hasAssert: hasComment("Assert"),
    isValid: missingComments.length === 0,
    missingComments: [...missingComments] as string[],
  };
};

/**
 * Example usage in tests:
 *
 * describe('Component Test', () => {
 *   it('should do something', () => {
 *     // Arrange
 *     const props = {...};
 *
 *     // Act
 *     render(<Component {...props} />);
 *
 *     // Assert
 *     expect(...).toBe(...);
 *   });
 * });
 */
