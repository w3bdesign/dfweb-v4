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
});
