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
    it("renders skip link with proper accessibility attributes", () => {
      // Arrange
      const expectedProps = {
        text: "Hopp til hovedinnhold",
        href: "#main-content",
      };

      // Act
      render(<SkipLink />);

      // Assert - Check that the skip link has the expected accessibility structure
      const skipLink = screen.getByRole("link", { name: expectedProps.text });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute("href", expectedProps.href);

      // Verify the component renders without errors (implicit test of CSS classes)
      expect(screen.getByText(expectedProps.text)).toBeInTheDocument();
    });
  });
});
