import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import ErrorFallback from "@/components/ErrorBoundary/ErrorFallback.component";

// Mock the Matrix component to avoid rendering issues in tests
jest.mock("@/components/Animations/Matrix.component", () => {
  return function DummyMatrix() {
    return <div data-testid="matrix-animation" />;
  };
});

describe("ErrorFallback", () => {
  const mockError = new Error("Test error message");

  beforeEach(() => {
    // Mock window.location.reload
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  it("renders error message and reload button", () => {
    // Arrange
    const expectedTexts = {
      heading: "Har du funnet en feil i Matrix?",
      error: "Test error message",
      button: "Returner til Matrix"
    };
    
    // Act
    render(<ErrorFallback error={mockError} />);
    
    // Assert
    expect(screen.getByText(expectedTexts.heading)).toBeInTheDocument();
    expect(screen.getByText(expectedTexts.error)).toBeInTheDocument();
    expect(screen.getByText(expectedTexts.button)).toBeInTheDocument();
  });

  it("displays default error message when error.message is undefined", () => {
    // Arrange
    const errorWithoutMessage = new Error();
    const expectedMessage = "En uventet feil har oppstått.";
    
    // Act
    render(<ErrorFallback error={errorWithoutMessage} />);
    
    // Assert
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it("reloads the page when the reload button is clicked", () => {
    // Arrange
    render(<ErrorFallback error={mockError} />);
    const reloadButton = screen.getByRole("button", {
      name: "Returner til Matrix"
    });
    
    // Act
    fireEvent.click(reloadButton);
    
    // Assert
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});
