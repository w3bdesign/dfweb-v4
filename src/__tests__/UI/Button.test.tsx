/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "@/components/UI/Button.component";

describe("Button", () => {
  describe("Button Component", () => {
    it("renders button and handles click events", async () => {
      // Arrange
      const handleClick = jest.fn();
      const buttonText = "Click Me";

      // Act
      render(<Button onClick={handleClick}>{buttonText}</Button>);
      const button = screen.getByRole("button", { name: buttonText });
      await userEvent.click(button);

      // Assert
      expect(button).toBeInTheDocument();
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(button).toHaveTextContent(buttonText);
    });

    const testCases = [
      { children: "Save", ariaLabel: "Save changes" },
      { children: "Delete", ariaLabel: "Delete item" },
      { children: "Edit", ariaLabel: "Edit profile" },
    ];

    testCases.forEach(({ children, ariaLabel }) => {
      it(`renders button with '${children}' text and '${ariaLabel}' aria-label`, () => {
        // Arrange
        const props = {
          onClick: jest.fn(),
          "aria-label": ariaLabel,
        };

        // Act
        render(<Button {...props}>{children}</Button>);
        const button = screen.getByRole("button", { name: ariaLabel });

        // Assert
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("aria-label", ariaLabel);
        expect(button).toHaveTextContent(children);
      });
    });

    it("is disabled when disabled prop is true", () => {
      // Arrange
      const handleClick = jest.fn();

      // Act
      render(
        <Button onClick={handleClick} disabled>
          Disabled Button
        </Button>,
      );
      const button = screen.getByRole("button");

      // Assert
      expect(button).toBeDisabled();
      expect(button).not.toBeEnabled();
    });
  });
});
