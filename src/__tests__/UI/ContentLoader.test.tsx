import { render, screen } from "@testing-library/react";
import ContentLoader from "@/components/UI/ContentLoader.component";

describe("ContentLoader", () => {
  describe("Hero type", () => {
    it("renders hero skeleton with correct structure", () => {
      // Arrange - Set up test data and conditions
      const props = { type: "hero" as const };

      // Act - Perform the action being tested
      render(<ContentLoader {...props} />);

      // Assert - Verify the results
      const article = screen.getByRole("article");
      expect(article).toHaveClass(
        "relative",
        "flex",
        "flex-col",
        "justify-center",
        "h-[32rem]",
        "md:h-[30rem]",
      );
    });

    it("renders hero content skeletons", () => {
      // Arrange - Set up test data and conditions
      const props = { type: "hero" as const };

      // Act - Perform the action being tested
      render(<ContentLoader {...props} />);

      // Assert - Verify the results
      // Should have 1 title + 1 subtitle + 1 description + 3 icons = 6 skeletons
      const skeletons = screen.getAllByRole("generic", {
        name: (_, element) =>
          element?.classList.contains("animate-pulse") &&
          element?.classList.contains("bg-slate-700"),
      });

      expect(skeletons).toHaveLength(6);
    });
  });

  describe("Section type", () => {
    it("renders single section by default", () => {
      // Arrange - Set up test data and conditions
      const props = { type: "section" as const };

      // Act - Perform the action being tested
      render(<ContentLoader {...props} />);

      // Assert - Verify the results
      const sections = screen.getAllByTestId("content-section");
      expect(sections).toHaveLength(1);
    });

    it("renders multiple sections when specified", () => {
      // Arrange - Set up test data and conditions
      const props = { type: "section" as const, sections: 3 };

      // Act - Perform the action being tested
      render(<ContentLoader {...props} />);

      // Assert - Verify the results
      const sections = screen.getAllByTestId("content-section");
      expect(sections).toHaveLength(3);
    });

    it("alternates section backgrounds", () => {
      // Arrange - Set up test data and conditions
      const props = { type: "section" as const, sections: 2 };

      // Act - Perform the action being tested
      render(<ContentLoader {...props} />);

      // Assert - Verify the results
      const sections = screen.getAllByTestId("content-section");
      expect(sections[0]).toHaveClass("bg-slate-900");
      expect(sections[1]).toHaveClass("bg-slate-800/30");
    });

    it("sections have contain-layout class", () => {
      // Arrange - Set up test data and conditions
      const props = { type: "section" as const };

      // Act - Perform the action being tested
      render(<ContentLoader {...props} />);

      // Assert - Verify the results
      const section = screen.getByTestId("content-section");
      expect(section).toHaveClass("contain-layout");
    });
  });

  describe("Custom type", () => {
    it("renders custom children", () => {
      // Arrange - Set up test data and conditions
      const customContent = (
        <div data-testid="custom-content">Custom loading content</div>
      );

      // Act - Perform the action being tested
      render(<ContentLoader type="custom">{customContent}</ContentLoader>);

      // Assert - Verify the results
      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    });
  });
});
