import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RotatingLoader from "@/components/Animations/RotatingLoader.component";

describe("RotatingLoader", () => {
  describe("rendering", () => {
    it("renders component structure with correct classes and attributes", () => {
      // Arrange
      const expectedClasses = {
        wrapper: "grid min-h-[140px] w-full place-items-center",
        svg: "animate-spin",
        paths: ["stroke-matrix-dark", "stroke-matrix-light"],
      };

      // Act
      render(<RotatingLoader />);
      const wrapperDiv = screen.getByTestId("rotating-loader");
      const svg = screen.getByTestId("loader-svg");
      const paths = screen.getAllByTestId("loader-path");

      // Assert
      expect(wrapperDiv).toHaveClass(expectedClasses.wrapper);
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass(expectedClasses.svg);
      expect(paths).toHaveLength(2);
      expect(paths[0]).toHaveClass(expectedClasses.paths[0]);
      expect(paths[1]).toHaveClass(expectedClasses.paths[1]);
    });
  });

  describe("animations", () => {
    it("applies correct animation classes", () => {
      // Arrange
      const expectedAnimations = {
        glow: "animate-matrix-glow",
        spin: "animate-spin",
      };

      // Act
      render(<RotatingLoader />);
      const glowContainer = screen.getByTestId("glow-container");
      const svg = screen.getByTestId("loader-svg");

      // Assert
      expect(glowContainer).toBeInTheDocument();
      expect(glowContainer).toHaveClass(expectedAnimations.glow);
      expect(svg).toHaveClass(expectedAnimations.spin);
    });
  });
});
