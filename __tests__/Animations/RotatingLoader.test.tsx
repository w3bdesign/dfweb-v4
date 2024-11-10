import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import RotatingLoader from "../../src/components/Animations/RotatingLoader.component";

describe("RotatingLoader", () => {
  it("renders without crashing", () => {
    render(<RotatingLoader />);
  });

  it("has the correct structure", () => {
    const { container } = render(<RotatingLoader />);

    // Check for the main wrapper div
    const wrapperDiv = container.firstChild;
    expect(wrapperDiv).toHaveClass("grid min-h-[140px] w-full place-items-center");

    // Check for the SVG element
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("animate-spin");

    // Check for the paths with Matrix theme colors
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2);
    expect(paths[0]).toHaveClass("stroke-matrix-dark");
    expect(paths[1]).toHaveClass("stroke-matrix-light");
  });

  it("has the correct animations", () => {
    const { container } = render(<RotatingLoader />);
    
    // Check for glow animation container
    const glowContainer = container.querySelector(".animate-matrix-glow");
    expect(glowContainer).toBeInTheDocument();

    // Check for spin animation on SVG
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("animate-spin");
  });
});
