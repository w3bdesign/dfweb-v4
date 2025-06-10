import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

describe("ErrorBoundary", () => {
  let consoleErrorSpy: jest.SpyInstance;
  const errorMock = new Error("Dette er en testfeil");

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should render children when there is no error", () => {
    // Arrange
    const testContent = "Test Innhold";

    // Act
    render(
      <ErrorBoundary>
        <div>{testContent}</div>
      </ErrorBoundary>,
    );

    // Assert
    expect(screen.getByText(testContent)).toBeInTheDocument();
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
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    // Assert
    expect(screen.getByText(expectedTexts.heading)).toBeInTheDocument();
    expect(screen.getByText(expectedTexts.error)).toBeInTheDocument();
    expect(screen.getByText(expectedTexts.button)).toBeInTheDocument();
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
