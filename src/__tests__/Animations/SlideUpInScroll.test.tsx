import { render, screen } from "@testing-library/react";
import SlideUpInScroll from "@/components/Animations/SlideUpInScroll.component";
import React from "react";

// Mock framer-motion
vi.mock("motion/react-m", () => ({
  div: ({
    children,
    className,
    "data-testid": testId,
  }: {
    children: React.ReactNode;
    className: string;
    "data-testid": string;
  }) => (
    <div className={className} data-testid={testId}>
      {children}
    </div>
  ),
}));

vi.mock("motion/react", () => ({
  Variants: {},
}));

/**
 * Helper to render SlideUpInScroll and assert element + content are present.
 */
function renderAndAssertSlideUpInScroll(
  props: Partial<React.ComponentProps<typeof SlideUpInScroll>> = {},
  testContent = "Test content",
) {
  // Arrange & Act
  const result = render(
    <SlideUpInScroll {...props}>
      <div>{testContent}</div>
    </SlideUpInScroll>,
  );

  // Assert
  const element = screen.getByTestId("slideupinscroll");
  expect(element).toBeInTheDocument();
  expect(screen.getByText(testContent)).toBeInTheDocument();

  return { element, ...result };
}

describe("SlideUpInScroll", () => {
  it("renders children content", () => {
    // Arrange
    const testContent = "Test content";

    // Act
    render(
      <SlideUpInScroll>
        <div>{testContent}</div>
      </SlideUpInScroll>,
    );

    // Assert
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("applies custom CSS class", () => {
    // Arrange
    const testClass = "test-class";

    // Act
    render(
      <SlideUpInScroll cssClass={testClass}>
        <div>Test content</div>
      </SlideUpInScroll>,
    );

    // Assert
    expect(screen.getByTestId("slideupinscroll")).toHaveClass(testClass);
  });

  it("configures viewport with default amount when viewAmount not provided", () => {
    // Arrange & Act & Assert
    renderAndAssertSlideUpInScroll();
  });

  it("configures viewport with custom amount when viewAmount provided", () => {
    // Arrange & Act & Assert
    renderAndAssertSlideUpInScroll({ viewAmount: 0.5 });
  });

  it("configures for instant animation when instant prop is true", () => {
    // Arrange & Act & Assert
    renderAndAssertSlideUpInScroll({ instant: true });
  });

  it("handles all viewport amount types", () => {
    // Arrange
    const amounts: Array<"some" | "all" | number> = ["some", "all", 0.7];

    amounts.forEach((amount) => {
      // Act
      const { unmount } = render(
        <SlideUpInScroll viewAmount={amount}>
          <div>Test content</div>
        </SlideUpInScroll>,
      );

      // Assert
      const element = screen.getByTestId("slideupinscroll");
      expect(element).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();

      // Cleanup
      unmount();
    });
  });
});
