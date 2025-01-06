import { render, screen } from '@testing-library/react';
import Button from '@/components/UI/Button.component';

describe('ESLint AAA Rule Tests', () => {
  // This test should pass ESLint - has AAA comments
  it('should pass ESLint with AAA comments', () => {
    // Arrange
    const buttonText = 'Click me';

    // Act
    render(<Button>{buttonText}</Button>);

    // Assert
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  // This test should fail ESLint - no AAA comments
  it('should fail ESLint without AAA comments', () => {
    const buttonText = 'Click me';
    render(<Button>{buttonText}</Button>);
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });
});
