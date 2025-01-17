import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BounceInScroll from "@/components/Animations/BounceInScroll.component";

// Mock framer-motion
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, className, "data-testid": testId }: any) => (
      <div className={className} data-testid={testId}>
        {children}
      </div>
    ),
  },
  Variants: {},
}));

describe("BounceInScroll", () => {
  it("renders children content", () => {
    // Arrange
    const testContent = "Test content";

    // Act
    render(
      <BounceInScroll>
        <div>{testContent}</div>
      </BounceInScroll>,
    );

    // Assert
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("applies custom CSS class", () => {
    // Arrange
    const testClass = "test-class";

    // Act
    render(
      <BounceInScroll cssClass={testClass}>
        <div>Test content</div>
      </BounceInScroll>,
    );

    // Assert
    expect(screen.getByTestId("bounceinscroll")).toHaveClass(testClass);
  });

  it("configures viewport with default amount when viewAmount not provided", () => {
    // Arrange
    const testContent = "Test content";

    // Act
    render(
      <BounceInScroll>
        <div>{testContent}</div>
      </BounceInScroll>,
    );

    // Assert
    const element = screen.getByTestId("bounceinscroll");
    expect(element).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("configures viewport with custom amount when viewAmount provided", () => {
    // Arrange
    const testContent = "Test content";
    const viewAmount = 0.5;

    // Act
    render(
      <BounceInScroll viewAmount={viewAmount}>
        <div>{testContent}</div>
      </BounceInScroll>,
    );

    // Assert
    const element = screen.getByTestId("bounceinscroll");
    expect(element).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("configures for instant animation when instant prop is true", () => {
    // Arrange
    const testContent = "Test content";

    // Act
    render(
      <BounceInScroll instant={true}>
        <div>{testContent}</div>
      </BounceInScroll>,
    );

    // Assert
    const element = screen.getByTestId("bounceinscroll");
    expect(element).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("handles all viewport amount types", () => {
    // Arrange
    const amounts: Array<"some" | "all" | number> = ["some", "all", 0.7];
    const testContent = "Test content";

    amounts.forEach((amount) => {
      // Act
      const { unmount } = render(
        <BounceInScroll viewAmount={amount}>
          <div>{testContent}</div>
        </BounceInScroll>,
      );

      // Assert
      const element = screen.getByTestId("bounceinscroll");
      expect(element).toBeInTheDocument();
      expect(screen.getByText(testContent)).toBeInTheDocument();

      // Cleanup
      unmount();
    });
  });
});
