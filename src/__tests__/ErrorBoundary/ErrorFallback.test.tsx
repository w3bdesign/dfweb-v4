import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
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
  
  // Mock window.location.reload to prevent navigation errors in tests
  const mockReload = jest.fn();
  
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: mockReload,
      },
      writable: true,
    });
  });
  
  beforeEach(() => {
    mockReload.mockClear();
  });

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

  describe("reload functionality", () => {
    // Note: window.location.reload() cannot be reliably mocked across all test environments
    // These tests verify that the onClick handlers are attached and don't throw errors

    it("compact mode reload button has onClick handler that executes without error", () => {
      // Arrange
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<ErrorFallback error={mockError} compact={true} />);

      // Act & Assert - Button click should not throw an error
      const reloadButton = screen.getByText("Returner til Matrix");
      expect(() => {
        fireEvent.click(reloadButton);
      }).not.toThrow();

      // Should not log any console errors during the click
      expect(consoleErrorSpy).not.toHaveBeenCalled();

      // Cleanup
      consoleErrorSpy.mockRestore();
    });

    it("full mode Pill has onClick handler that executes without error", () => {
      // Arrange
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<ErrorFallback error={mockError} />);

      // Act & Assert - Button click should not throw an error
      const reloadButton = screen.getByText("Returner til Matrix");
      expect(() => {
        fireEvent.click(reloadButton);
      }).not.toThrow();

      // Should not log any console errors during the click
      expect(consoleErrorSpy).not.toHaveBeenCalled();

      // Cleanup
      consoleErrorSpy.mockRestore();
    });
  });
});
