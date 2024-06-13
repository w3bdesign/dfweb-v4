import React from "react";
import { render, screen } from "@testing-library/react";
import ReactMatrixAnimation from "../../src/components/Animations/Matrix.component";

describe("ReactMatrixAnimation", () => {
  test("renders the canvas element", () => {
    render(<ReactMatrixAnimation />);
    const canvas = screen.getByTestId("matrix-canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("id", "matrixCanvas");
    expect(canvas).toHaveStyle("width: 100%");
  });

  test("initializes with default props", () => {
    render(<ReactMatrixAnimation />);
    const canvas = screen.getByTestId("matrix-canvas");
    expect(canvas).toBeInTheDocument();
  });

  test("initializes with custom props", () => {
    render(
      <ReactMatrixAnimation
        tileSize={30}
        fadeFactor={0.1}
        backgroundColor="#000000"
        fontColor="#FFFFFF"
        tileSet={["A", "B", "C"]}
      />,
    );
    const canvas = screen.getByTestId("matrix-canvas");
    expect(canvas).toBeInTheDocument();
  });

  test("throws error for invalid background color", () => {
    expect(() => {
      render(<ReactMatrixAnimation backgroundColor="invalid" />);
    }).toThrow("Invalid background color. Use a hex value e.g. #030303");
  });

  test("throws error for invalid font color", () => {
    expect(() => {
      render(<ReactMatrixAnimation fontColor="invalid" />);
    }).toThrow("Invalid font color. Use a hex value e.g. #030303");
  });
});
