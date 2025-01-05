import { render } from '@testing-library/react';
import { checkAAAPattern } from '../src/utils/test-utils';

describe('AAA Pattern Checker', () => {
  const testCases = [
    {
      name: 'test without any AAA comments',
      content: `
        it('test', () => {
          const element = <div>Test</div>;
          render(element);
          expect(element).toBeDefined();
        });
      `,
      expectedValid: false,
      expectedMissing: ['Arrange', 'Act', 'Assert']
    },
    {
      name: 'test with only Arrange comment',
      content: `
        it('test', () => {
          // Arrange
          const element = <div>Test</div>;
          render(element);
          expect(element).toBeDefined();
        });
      `,
      expectedValid: false,
      expectedMissing: ['Act', 'Assert']
    },
    {
      name: 'test with all AAA comments',
      content: `
        it('test', () => {
          // Arrange
          const element = <div>Test</div>;
          
          // Act
          render(element);
          
          // Assert
          expect(element).toBeDefined();
        });
      `,
      expectedValid: true,
      expectedMissing: []
    }
  ];

  testCases.forEach(({ name, content, expectedValid, expectedMissing }) => {
    it(`correctly analyzes ${name}`, () => {
      const result = checkAAAPattern(content);
      expect(result.isValid).toBe(expectedValid);
      expect(result.missingComments).toEqual(expectedMissing);
    });
  });
});
