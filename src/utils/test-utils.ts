/**
 * Helper function to check if a test follows the AAA pattern
 * @param testContent The content of the test to check
 * @returns Object containing check results
 */
export const checkAAAPattern = (testContent: string) => {
  const hasArrange = testContent.includes("// Arrange");
  const hasAct = testContent.includes("// Act");
  const hasAssert = testContent.includes("// Assert");

  return {
    hasArrange,
    hasAct,
    hasAssert,
    isValid: hasArrange && hasAct && hasAssert,
    missingComments: [
      !hasArrange && "Arrange",
      !hasAct && "Act",
      !hasAssert && "Assert",
    ].filter(Boolean),
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
