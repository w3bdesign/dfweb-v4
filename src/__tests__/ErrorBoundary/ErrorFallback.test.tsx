import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ErrorFallback from "@/components/ErrorBoundary/ErrorFallback.component";

// Mock the Matrix component to avoid rendering issues in tests
jest.mock("@/components/Animations/Matrix.component", () => {
  return function DummyMatrix() {
    return <div data-testid="matrix-animation" />;
  };
});

describe("ErrorFallback", () => {
  const mockError = new Error("Test error message");

  it("renders error message", () => {
    // Arrange
    const expectedTexts = {
      heading: "Har du funnet en feil i Matrix?",
      error: "Test error message",
    };

    // Act
    render(<ErrorFallback error={mockError} />);

    // Assert
    expect(screen.getByText(expectedTexts.heading)).toBeInTheDocument();
    expect(screen.getByText(expectedTexts.error)).toBeInTheDocument();
  });

  it("displays default error message when error.message is undefined in full version", () => {
    // Arrange
    const errorWithoutMessage = new Error();
    const expectedMessage = "En uventet feil har oppstått.";

    // Act
    render(<ErrorFallback error={errorWithoutMessage} />);

    // Assert
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it("displays default error message when error.message is undefined in compact version", () => {
    // Arrange
    const errorWithoutMessage = new Error();
    const expectedMessage = "En uventet feil har oppstått.";

    // Act
    render(<ErrorFallback error={errorWithoutMessage} compact={true} />);

    // Assert
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it("renders compact version with correct styling", () => {
    // Arrange
    const expectedTexts = {
      heading: "Har du funnet en feil i Matrix?",
      error: "Test error message",
    };

    // Act
    render(<ErrorFallback error={mockError} compact={true} />);

    // Assert
    const container = screen.getByTestId("error-fallback-container");
    expect(container).toHaveClass("bg-gray-900");
    expect(container).toHaveClass("p-4");
    expect(container).toHaveClass("rounded-lg");
    expect(container).toHaveClass("overflow-hidden");
    expect(screen.getByText(expectedTexts.heading)).toHaveClass("text-lg");
    expect(screen.getByText(expectedTexts.error)).toHaveClass("text-sm");
  });

  it("renders full version with correct styling", () => {
    // Arrange
    const expectedTexts = {
      heading: "Har du funnet en feil i Matrix?",
      error: "Test error message",
    };

    // Act
    render(<ErrorFallback error={mockError} compact={false} />);

    // Assert
    const container = screen.getByTestId("error-fallback-container");
    expect(container).toHaveClass("absolute", "w-full", "h-full");
    expect(screen.getByText(expectedTexts.heading)).toHaveClass("text-5xl");
    expect(screen.getByText(expectedTexts.error)).toHaveClass("text-xl");
  });
});
