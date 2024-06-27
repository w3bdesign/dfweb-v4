import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReactMatrixAnimation from "../../src/components/Animations/Matrix.component";

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

  test("renders without crashing", () => {
    render(<ReactMatrixAnimation />);
    const canvas = screen.getByTestId("matrix-canvas");
    expect(canvas).toBeInTheDocument();
  });

  test("applies default props correctly", () => {
    render(<ReactMatrixAnimation />);
    const canvas = screen.getByTestId("matrix-canvas");
    expect(canvas).toHaveStyle("width: 100%");
    expect(canvas).toHaveStyle("height: 100%");
  });

  test("applies custom props correctly", () => {
    const customProps = {
      tileSize: 30,
      fadeFactor: 0.7,
      backgroundColor: "#000000",
      fontColor: "#ffffff",
      tileSet: ["A", "B", "C"],
    };
    render(<ReactMatrixAnimation {...customProps} />);
    const canvas = screen.getByTestId("matrix-canvas");
    expect(canvas).toBeInTheDocument();
  });

  test("throws error for invalid background color", () => {
    console.error = jest.fn(); // Suppress console.error for this test
    expect(() => {
      render(<ReactMatrixAnimation backgroundColor="invalid" />);
    }).toThrow("Invalid background color. Use a hex value e.g. #030303");
  });

  test("throws error for invalid font color", () => {
    console.error = jest.fn(); // Suppress console.error for this test
    expect(() => {
      render(<ReactMatrixAnimation fontColor="invalid" />);
    }).toThrow("Invalid font color. Use a hex value e.g. #030303");
  });
});
