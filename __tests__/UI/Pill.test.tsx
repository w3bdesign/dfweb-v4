import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import Pill from "../../src/components/UI/Pill.component";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("Pill Component", () => {
  describe("rendering", () => {
    it("renders as button with default props", () => {
      // Arrange
      const text = "Test Pill";
      
      // Act
      render(<Pill text={text} />);
      const pill = screen.getByText(text);
      
      // Assert
      expect(pill).toBeInTheDocument();
      expect(pill.tagName).toBe("BUTTON");
      expect(pill).toHaveAttribute("data-text", text);
    });

    it("renders as link when href is provided", () => {
      // Arrange
      const props = {
        text: "Link Pill",
        href: "/test"
      };
      
      // Act
      render(<Pill {...props} />);
      const pill = screen.getByText(props.text);
      
      // Assert
      expect(pill).toBeInTheDocument();
      expect(pill.tagName).toBe("A");
      expect(pill).toHaveAttribute("href", props.href);
      expect(pill).toHaveAttribute("data-text", props.text);
    });

    it("applies custom className alongside base classes", () => {
      // Arrange
      const props = {
        text: "Custom Class",
        className: "custom-class"
      };
      const baseClasses = [
        "glitch", "text-white", "m-4", "text-xl", "p-6", "mt-4",
        "rounded-full", "transition", "duration-300", "ease-in-out",
        "transform", "bg-blue-600", "bg-opacity-20", "border-2",
        "border-blue-800", "border-opacity-30", "hover:bg-blue-400",
        "hover:bg-opacity-30", "backdrop-blur-sm"
      ];
      
      // Act
      render(<Pill {...props} />);
      const pill = screen.getByText(props.text);
      
      // Assert
      expect(pill).toHaveClass(...baseClasses, props.className);
    });
  });

  describe("interactions", () => {
    it("calls onClick when clicked as button", () => {
      // Arrange
      const mockOnClick = jest.fn();
      const props = {
        text: "Clickable Pill",
        onClick: mockOnClick
      };
      
      // Act
      render(<Pill {...props} />);
      const pill = screen.getByText(props.text);
      fireEvent.click(pill);
      
      // Assert
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when rendered as link", () => {
      // Arrange
      const mockOnClick = jest.fn();
      const props = {
        text: "Link Pill",
        href: "/test",
        onClick: mockOnClick
      };
      
      // Act
      render(<Pill {...props} />);
      const pill = screen.getByText(props.text);
      fireEvent.click(pill);
      
      // Assert
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });
});
