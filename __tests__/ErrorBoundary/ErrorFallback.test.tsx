import React from "react";
import { render, screen } from "@testing-library/react";

import ErrorFallback from "../../src/components/ErrorBoundary/ErrorFallback.component";

// Mock the Matrix component to avoid rendering issues in tests
jest.mock("../../src/components/Animations/Matrix.component", () => {
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
    render(<ErrorFallback error={mockError} />);

    expect(
      screen.getByText("Har du funnet en feil i Matrix?")
    ).toBeInTheDocument();
    expect(screen.getByText("Test error message")).toBeInTheDocument();
    expect(screen.getByText("Returner til Matrix")).toBeInTheDocument();
  });

  it("displays default error message when error.message is undefined", () => {
    const errorWithoutMessage = new Error();
    render(<ErrorFallback error={errorWithoutMessage} />);

    expect(
      screen.getByText("En uventet feil har oppstått.")
    ).toBeInTheDocument();
  });
});
