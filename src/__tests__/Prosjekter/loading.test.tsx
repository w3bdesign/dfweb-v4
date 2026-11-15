import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "@/app/prosjekter/loading";

// Mock the components used in Loading
vi.mock("@/components/UI/PageHeader.component", () => ({
  default: function MockPageHeader({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <h1>{children}</h1>;
  },
}));

vi.mock("@/components/Animations/RotatingLoader.component", () => ({
  default: function MockRotatingLoader() {
    return <div data-testid="rotating-loader">Loading...</div>;
  },
}));

describe("Loading", () => {
  describe("rendering", () => {
    it("renders loading state with correct content and attributes", () => {
      // Arrange
      const expected = {
        header: "Prosjekter",
        testId: "rotating-loader",
        mainAttributes: {
          ariaLabel: "Laster portefølje",
          classes: ["mt-32", "bg-graybg"],
        },
      };

      // Act
      render(<Loading />);
      const main = screen.getByRole("main");

      // Assert
      expect(screen.getByText(expected.header)).toBeInTheDocument();
      expect(screen.getByTestId(expected.testId)).toBeInTheDocument();
      expect(main).toHaveAttribute(
        "aria-label",
        expected.mainAttributes.ariaLabel,
      );
      expected.mainAttributes.classes.forEach((className) => {
        expect(main).toHaveClass(className);
      });
    });
  });
});
