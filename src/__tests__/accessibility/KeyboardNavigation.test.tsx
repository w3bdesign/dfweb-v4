import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Button from '@/components/UI/Button.component';
import InputField from '@/components/UI/InputField.component';
import Hamburger from '@/components/Layout/Hamburger.component';
import { useForm } from 'react-hook-form';

describe('Keyboard Navigation Accessibility', () => {
  describe('Focus Indicators', () => {
    // Arrange
    beforeEach(() => {
      // Inject our CSS to test focus styles
      const style = document.createElement('style');
      style.textContent = `
        :focus-visible {
          outline: 2px solid var(--matrix);
          outline-offset: 2px;
        }
      `;
      document.head.appendChild(style);
    });

    // Act & Assert
    it('should show focus indicator on Button when tabbed to', async () => {
      const user = userEvent.setup();
      render(<Button>Test Button</Button>);
      
      const button = screen.getByRole('button');
      await user.tab();
      
      expect(button).toHaveFocus();
      expect(button).toHaveStyle({
        outline: '2px solid var(--matrix)',
        outlineOffset: '2px'
      });
    });

    it('should support keyboard navigation through form fields', async () => {
      // Arrange
      const TestForm = () => {
        const { register } = useForm();
        return (
          <>
            <InputField
              name="test1"
              label="Field 1"
              htmlFor="test1"
              register={register}
            />
            <InputField
              name="test2"
              label="Field 2"
              htmlFor="test2"
              register={register}
            />
            <Button>Submit</Button>
          </>
        );
      };

      // Act
      const user = userEvent.setup();
      render(<TestForm />);
      
      const input1 = screen.getByLabelText('Field 1');
      const input2 = screen.getByLabelText('Field 2');
      const submitButton = screen.getByRole('button');

      // Assert
      await user.tab();
      expect(input1).toHaveFocus();
      
      await user.tab();
      expect(input2).toHaveFocus();
      
      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Touch Targets', () => {
    // Arrange
    beforeEach(() => {
      // Mock coarse pointer for mobile
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(pointer: coarse)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    // Act & Assert
    it('should have minimum 44px touch targets on mobile', () => {
      render(<Button>Test Button</Button>);
      const button = screen.getByRole('button');
      
      const styles = window.getComputedStyle(button);
      const minHeight = parseInt(styles.minHeight) || 0;
      
      expect(minHeight).toBeGreaterThanOrEqual(44);
    });
  });
});

describe('ARIA Attributes', () => {
  // Arrange
  const mockOnClick = jest.fn();

  // Act & Assert
  it('should have proper aria-label on icon-only buttons', () => {
    render(
      <Button aria-label="Open menu">
        ☰
      </Button>
    );
    
    const button = screen.getByRole('button', { name: 'Open menu' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Open menu');
  });

  it('should have proper aria-expanded on Hamburger menu', () => {
    // Arrange
    const { rerender } = render(
      <Hamburger onClick={mockOnClick} animatetoX={false} />
    );
    
    // Act
    const button = screen.getByRole('button');
    
    // Assert
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-label', 'Åpne meny');
    
    rerender(<Hamburger onClick={mockOnClick} animatetoX={true} />);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-label', 'Lukk meny');
  });

  it('should have screen reader text for hamburger menu', () => {
    // Arrange
    render(<Hamburger onClick={mockOnClick} animatetoX={false} />);
    
    // Act
    const srText = screen.getByText('Åpne navigasjonsmeny');
    
    // Assert
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveClass('sr-only');
  });
});

describe('Form Accessibility', () => {
  // Arrange
  const TestForm = () => {
    const { register } = useForm();
    return (
      <InputField
        name="phone"
        label="Phone Number"
        htmlFor="phone"
        register={register}
        autoComplete="tel"
        inputMode="tel"
        spellCheck={false}
      />
    );
  };

  // Act & Assert
  it('should have autocomplete attributes on form fields', () => {
    render(<TestForm />);
    const input = screen.getByLabelText('Phone Number');
    
    expect(input).toHaveAttribute('autoComplete', 'tel');
    expect(input).toHaveAttribute('inputMode', 'tel');
    expect(input).toHaveAttribute('spellCheck', 'false');
  });

  it('should trim whitespace from input values', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockSubmit = jest.fn();
    
    const TestFormWithSubmit = () => {
      const { register, handleSubmit } = useForm();
      return (
        <form onSubmit={handleSubmit(mockSubmit)}>
          <InputField
            name="testField"
            label="Test Field"
            htmlFor="testField"
            register={register}
          />
          <Button type="submit">Submit</Button>
        </form>
      );
    };
    
    // Act
    render(<TestFormWithSubmit />);
    const input = screen.getByLabelText('Test Field');
    const submitButton = screen.getByRole('button');
    
    await user.type(input, '  test value  ');
    await user.click(submitButton);
    
    // Assert
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        testField: 'test value'
      })
    );
  });
});

describe('Reduced Motion', () => {
  // Arrange
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  // Act & Assert
  it('should respect prefers-reduced-motion', () => {
    const style = document.createElement('style');
    style.textContent = `
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button');
    
    const styles = window.getComputedStyle(button);
    expect(styles.transitionDuration).toBe('0.01ms');
  });
});