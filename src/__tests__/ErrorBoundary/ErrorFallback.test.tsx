import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import ErrorFallback from "@/components/ErrorBoundary/ErrorFallback.component";

// Mock the Matrix component to avoid rendering issues in tests
jest.mock("@/components/Animations/Matrix.component", () => {
  return function DummyMatrix() {
    return <div data-testid="matrix-animation" />;
  };
});

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

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
    const container = screen
      .getByTestId("matrix-animation")
      .closest(".bg-gray-900");
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
    const container = screen.getByTestId("matrix-animation").parentElement;
    expect(container).toHaveClass("absolute", "w-full", "h-full");
    expect(screen.getByText(expectedTexts.heading)).toHaveClass("text-5xl");
    expect(screen.getByText(expectedTexts.error)).toHaveClass("text-xl");
  });

  it("reloads the page when reload button is clicked in compact mode", () => {
    // Arrange
    const reload = jest.fn();
    const router = { reload };
    render(
      <ErrorFallback error={mockError} compact={true} router={router as any} />,
    );
    const reloadButton = screen.getByRole("button", {
      name: "Returner til Matrix",
    });

    // Act
    fireEvent.click(reloadButton);

    // Assert
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("reloads the page when reload button is clicked in full mode", () => {
    // Arrange
    const reload = jest.fn();
    const router = { reload };
    render(
      <ErrorFallback error={mockError} compact={false} router={router as any} />,
    );
    const reloadButton = screen.getByRole("button", {
      name: "Returner til Matrix",
    });

    // Act
    fireEvent.click(reloadButton);

    // Assert
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
