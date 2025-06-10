import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";

import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("ErrorBoundary", () => {
  let consoleErrorSpy: jest.SpyInstance;
  const errorMock = new Error("Dette er en testfeil");

  beforeAll(() => {
    (useRouter as jest.Mock).mockReturnValue({
      reload: jest.fn(),
    });
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should render children when there is no error", () => {
    // Arrange
    const testContent = "Test Innhold";

    // Act
    const { getByText } = render(
      <ErrorBoundary>
        <div>{testContent}</div>
      </ErrorBoundary>,
    );

    // Assert
    expect(getByText(testContent)).toBeInTheDocument();
  });

  it("should render error fallback when there is an error", () => {
    // Arrange
    const ErrorComponent = () => {
      throw errorMock;
    };
    const expectedTexts = {
      heading: "Har du funnet en feil i Matrix?",
      error: "Dette er en testfeil",
      button: "Returner til Matrix",
    };

    // Act
    const { getByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    // Assert
    expect(getByText(expectedTexts.heading)).toBeInTheDocument();
    expect(getByText(expectedTexts.error)).toBeInTheDocument();
    expect(getByText(expectedTexts.button)).toBeInTheDocument();
  });

  it("should call console.error when an error occurs", () => {
    // Arrange
    const ErrorComponent = () => {
      throw errorMock;
    };
    const expectedErrorArgs = [
      "Uventet feil i Matrix:",
      errorMock,
      { componentStack: expect.any(String) },
    ];

    // Act
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    // Assert
    expect(consoleErrorSpy).toHaveBeenCalledWith(...expectedErrorArgs);
  });
});
