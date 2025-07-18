import { render, screen } from "@testing-library/react";
import ContentLoader from "@/components/UI/ContentLoader.component";

describe("ContentLoader", () => {
  describe("Hero type", () => {
    it("renders hero content skeletons", () => {
      // Arrange
      render(<ContentLoader type="hero" />);

      // Act
      const skeletons = screen.getAllByTestId("skeleton");

      // Assert
      expect(skeletons).toHaveLength(6);
    });
  });

  describe("Section type", () => {
    it("renders a single section by default", () => {
      // Arrange
      render(<ContentLoader type="section" />);

      // Act
      const sections = screen.getAllByTestId("content-section");

      // Assert
      expect(sections).toHaveLength(1);
    });

    it("renders multiple sections when specified", () => {
      // Arrange
      render(<ContentLoader type="section" sections={3} />);

      // Act
      const sections = screen.getAllByTestId("content-section");

      // Assert
      expect(sections).toHaveLength(3);
    });
  });

  describe("Custom type", () => {
    it("renders custom children", () => {
      // Arrange
      render(
        <ContentLoader type="custom">
          <div>Custom Content</div>
        </ContentLoader>,
      );

      // Act
      const customContent = screen.getByText("Custom Content");

      // Assert
      expect(customContent).toBeInTheDocument();
    });
  });
});
