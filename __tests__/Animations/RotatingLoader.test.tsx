import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import RotatingLoader from "@/components/Animations/RotatingLoader.component";

describe("RotatingLoader", () => {
  describe("rendering", () => {
    it("renders component structure with correct classes", () => {
      // Arrange
      const expectedClasses = {
        wrapper: "grid min-h-[140px] w-full place-items-center",
        svg: "animate-spin",
        paths: ["stroke-matrix-dark", "stroke-matrix-light"]
      };
      
      // Act
      const { container } = render(<RotatingLoader />);
      const wrapperDiv = container.firstChild;
      const svg = container.querySelector("svg");
      const paths = container.querySelectorAll("path");
      
      // Assert
      expect(wrapperDiv).toHaveClass(expectedClasses.wrapper);
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass(expectedClasses.svg);
      expect(paths.length).toBe(2);
      expect(paths[0]).toHaveClass(expectedClasses.paths[0]);
      expect(paths[1]).toHaveClass(expectedClasses.paths[1]);
    });
  });

  describe("animations", () => {
    it("applies correct animation classes", () => {
      // Arrange
      const expectedAnimations = {
        glow: "animate-matrix-glow",
        spin: "animate-spin"
      };
      
      // Act
      const { container } = render(<RotatingLoader />);
      const glowContainer = container.querySelector(`.${expectedAnimations.glow}`);
      const svg = container.querySelector("svg");
      
      // Assert
      expect(glowContainer).toBeInTheDocument();
      expect(svg).toHaveClass(expectedAnimations.spin);
    });
  });
});
