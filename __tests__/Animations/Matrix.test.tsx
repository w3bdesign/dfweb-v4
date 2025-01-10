import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReactMatrixAnimation from "@/components/Animations/Matrix.component";

const mockFillRect = jest.fn();
const mockFillText = jest.fn();

HTMLCanvasElement.prototype.getContext = () => ({
  fillRect: mockFillRect,
  fillText: mockFillText,
});

const mockContext = {
  fillRect: jest.fn(),
  fillText: jest.fn(),
};

HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));

describe("ReactMatrixAnimation", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) => setTimeout(cb, 0));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders canvas element with default props", () => {
      // Arrange
      const expectedTestId = "matrix-canvas";
      
      // Act
      render(<ReactMatrixAnimation />);
      const canvas = screen.getByTestId(expectedTestId);
      
      // Assert
      expect(canvas).toBeInTheDocument();
      expect(canvas).toHaveStyle({
        width: "100%",
        height: "100%"
      });
    });

    it("renders canvas element with custom props", () => {
      // Arrange
      const customProps = {
        tileSize: 30,
        fadeFactor: 0.7,
        backgroundColor: "#000000",
        fontColor: "#ffffff",
        tileSet: ["A", "B", "C"]
      };
      const expectedTestId = "matrix-canvas";
      
      // Act
      render(<ReactMatrixAnimation {...customProps} />);
      const canvas = screen.getByTestId(expectedTestId);
      
      // Assert
      expect(canvas).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    beforeEach(() => {
      // Arrange - Suppress console.error for validation tests
      console.error = jest.fn();
    });

    it("throws error for invalid background color", () => {
      // Arrange
      const invalidProps = { backgroundColor: "invalid" };
      const expectedError = "Invalid background color. Use a hex value e.g. #030303";
      
      // Act & Assert
      expect(() => {
        render(<ReactMatrixAnimation {...invalidProps} />);
      }).toThrow(expectedError);
    });

    it("throws error for invalid font color", () => {
      // Arrange
      const invalidProps = { fontColor: "invalid" };
      const expectedError = "Invalid font color. Use a hex value e.g. #030303";
      
      // Act & Assert
      expect(() => {
        render(<ReactMatrixAnimation {...invalidProps} />);
      }).toThrow(expectedError);
    });
  });
});
