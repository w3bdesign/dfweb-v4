import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SkipLink from "@/components/UI/SkipLink.component";

describe("SkipLink", () => {
  describe("rendering", () => {
    it("renders skip link with correct text", () => {
      // Arrange
      const expectedText = "Hopp til hovedinnhold";

      // Act
      render(<SkipLink />);
      const skipLink = screen.getByText(expectedText);

      // Assert
      expect(skipLink).toBeInTheDocument();
    });

    it("renders as link with correct href", () => {
      // Arrange
      const expectedProps = {
        text: "Hopp til hovedinnhold",
        href: "#main-content",
      };

      // Act
      render(<SkipLink />);
      const button = screen.getByRole("link", { name: expectedProps.text });

      // Assert
      expect(button).toHaveAttribute("href", expectedProps.href);
    });
  });

  describe("accessibility", () => {
    it("applies correct visibility classes for focus states", () => {
      // Arrange
      const expectedClasses = [
        "sr-only",
        "focus-within:not-sr-only",
        "focus-within:absolute",
        "focus-within:top-4",
        "focus-within:left-4",
        "focus-within:z-50",
      ];

      // Act
      render(<SkipLink />);
      
      // Assert - Check that the skip link has the expected accessibility structure
      const skipLink = screen.getByRole("link", { name: "Hopp til hovedinnhold" });
      expect(skipLink).toBeInTheDocument();
      
      // Test that the container wrapper has the expected CSS classes by finding it through the link
      const skipLinkContainer = skipLink.closest("div");
      expectedClasses.forEach((className) => {
        expect(skipLinkContainer).toHaveClass(className);
      });
    });
  });
});
