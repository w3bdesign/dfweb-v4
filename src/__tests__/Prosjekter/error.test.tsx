import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorBoundary from "@/app/prosjekter/error";

// Mock React's useEffect
const mockUseEffect = vi.hoisted(() => vi.fn());
vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  useEffect: (cb: () => void) => mockUseEffect(cb),
}));

describe("ErrorBoundary", () => {
  const mockReset = vi.fn();
  const mockError = new Error("Test error") as Error & { digest?: string };
  const mockProps = { error: mockError, reset: mockReset };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders error message and retry button", () => {
    // Arrange
    const expectedTexts = {
      errorMessage: "Noe gikk galt ved lasting av prosjekter",
      buttonText: "Prøv igjen",
    };

    // Act
    render(<ErrorBoundary {...mockProps} />);

    // Assert
    expect(screen.getByText(expectedTexts.errorMessage)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: expectedTexts.buttonText }),
    ).toBeInTheDocument();
  });

  it("calls reset when retry button is clicked", () => {
    // Arrange
    render(<ErrorBoundary {...mockProps} />);
    const retryButton = screen.getByRole("button", { name: "Prøv igjen" });

    // Act
    fireEvent.click(retryButton);

    // Assert
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("calls useEffect with error logging", () => {
    // Arrange
    render(<ErrorBoundary {...mockProps} />);
    const [effectCallback] = mockUseEffect.mock.calls[0];

    // Act
    effectCallback();

    // Assert
    expect(mockUseEffect).toHaveBeenCalled();
  });
});
