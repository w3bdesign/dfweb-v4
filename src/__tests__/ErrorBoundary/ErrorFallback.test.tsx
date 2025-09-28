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

  it("renders error message and reload button", () => {
    // Arrange
    const expectedTexts = {
      heading: "Har du funnet en feil i Matrix?",
      error: "Test error message",
      button: "Returner til Matrix",
    };

    // Act
    render(<ErrorFallback error={mockError} />);

    // Assert
    expect(screen.getByText(expectedTexts.heading)).toBeInTheDocument();
    expect(screen.getByText(expectedTexts.error)).toBeInTheDocument();
    expect(screen.getByText(expectedTexts.button)).toBeInTheDocument();
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
      button: "Returner til Matrix",
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
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-matrix-light");
    expect(button).toHaveClass("text-black");
    expect(button).toHaveClass("rounded-sm");
    expect(button).toHaveClass("text-sm");
  });

  it("renders full version with correct styling", () => {
    // Arrange
    const expectedTexts = {
      heading: "Har du funnet en feil i Matrix?",
      error: "Test error message",
      button: "Returner til Matrix",
    };

    // Act
    render(<ErrorFallback error={mockError} compact={false} />);

    // Assert
    const container = screen.getByTestId("error-fallback-container");
    expect(container).toHaveClass("absolute", "w-full", "h-full");
    expect(screen.getByText(expectedTexts.heading)).toHaveClass("text-5xl");
    expect(screen.getByText(expectedTexts.error)).toHaveClass("text-xl");
  });

  it("renders reload button with correct properties in compact mode", () => {
    // Arrange
    render(<ErrorFallback error={mockError} compact={true} />);
    const reloadButton = screen.getByRole("button", {
      name: "Returner til Matrix",
    });

    // Act & Assert
    expect(reloadButton).toBeInTheDocument();
    expect(reloadButton).toHaveClass("bg-matrix-light");
    expect(reloadButton).toHaveClass("text-black");
  });

  it("renders reload button with correct properties in full mode", () => {
    // Arrange
    render(<ErrorFallback error={mockError} compact={false} />);
    const reloadButton = screen.getByRole("button", {
      name: "Returner til Matrix",
    });

    // Act & Assert
    expect(reloadButton).toBeInTheDocument();
  });
  it("calls window.location.reload when compact reload button is clicked", () => {
    // Arrange
    const mockReload = jest.fn();
    const originalLocation = globalThis.location;

    Object.defineProperty(globalThis, "location", {
      value: {
        ...originalLocation,
        reload: mockReload,
      },
      writable: true,
    });

    render(<ErrorFallback error={mockError} compact={true} />);
    const reloadButton = screen.getByRole("button", {
      name: "Returner til Matrix",
    });

    // Act
    reloadButton.click();

    // Assert
    expect(mockReload).toHaveBeenCalled();

    // Cleanup
    Object.defineProperty(globalThis, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("calls window.location.reload when full reload button is clicked", () => {
    // Arrange
    const mockReload = jest.fn();
    const originalLocation = globalThis.location;

    Object.defineProperty(globalThis, "location", {
      value: {
        ...originalLocation,
        reload: mockReload,
      },
      writable: true,
    });

    render(<ErrorFallback error={mockError} compact={false} />);
    const reloadButton = screen.getByRole("button", {
      name: "Returner til Matrix",
    });

    // Act
    reloadButton.click();

    // Assert
    expect(mockReload).toHaveBeenCalled();

    // Cleanup
    Object.defineProperty(globalThis, "location", {
      value: originalLocation,
      writable: true,
    });
  });
});
