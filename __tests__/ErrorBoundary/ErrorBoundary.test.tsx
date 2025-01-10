import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

describe("ErrorBoundary", () => {
  let consoleErrorSpy;
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
    const { getByText } = render(
      <ErrorBoundary>
        <div>{testContent}</div>
      </ErrorBoundary>
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
      button: "Returner til Matrix"
    };
    
    // Act
    const { getByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
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
      expect.any(Object)
    ];
    
    // Act
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    // Assert
    expect(consoleErrorSpy).toHaveBeenCalledWith(...expectedErrorArgs);
  });
});
