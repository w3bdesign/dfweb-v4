import { render, screen } from "@testing-library/react";
import ContentLoader from "@/components/UI/ContentLoader.component";

describe("ContentLoader", () => {
  describe("Hero type", () => {
    it("renders hero skeleton with correct structure", () => {
      render(<ContentLoader type="hero" />);
      
      const article = screen.getByRole("article");
      expect(article).toHaveClass(
        "relative",
        "flex",
        "flex-col",
        "justify-center",
        "h-[32rem]",
        "md:h-[30rem]"
      );
    });

    it("renders hero content skeletons", () => {
      render(<ContentLoader type="hero" />);
      
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
      render(<ContentLoader type="section" />);
      
      const sections = screen.getAllByRole("region");
      expect(sections).toHaveLength(1);
    });

    it("renders multiple sections when specified", () => {
      render(<ContentLoader type="section" sections={3} />);
      
      const sections = screen.getAllByRole("region");
      expect(sections).toHaveLength(3);
    });

    it("alternates section backgrounds", () => {
      render(<ContentLoader type="section" sections={2} />);
      
      const sections = screen.getAllByRole("region");
      expect(sections[0]).toHaveClass("bg-slate-900");
      expect(sections[1]).toHaveClass("bg-slate-800/30");
    });

    it("sections have contain-layout class", () => {
      render(<ContentLoader type="section" />);
      
      const section = screen.getByRole("region");
      expect(section).toHaveClass("contain-layout");
    });
  });

  describe("Custom type", () => {
    it("renders custom children", () => {
      render(
        <ContentLoader type="custom">
          <div data-testid="custom-content">Custom loading content</div>
        </ContentLoader>
      );
      
      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    });
  });
});