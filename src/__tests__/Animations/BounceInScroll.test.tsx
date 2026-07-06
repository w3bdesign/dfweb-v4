import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BounceInScroll from "@/components/Animations/BounceInScroll.component";
import React from "react";

// Mock framer-motion
jest.mock("motion/react-m", () => ({
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

jest.mock("motion/react", () => ({
  Variants: {},
}));

/**
 * Helper to render BounceInScroll and assert element + content are present.
 */
function renderAndAssertBounceInScroll(
  props: Partial<React.ComponentProps<typeof BounceInScroll>> = {},
  testContent = "Test content",
) {
  // Arrange & Act
  const result = render(
    <BounceInScroll {...props}>
      <div>{testContent}</div>
    </BounceInScroll>,
  );

  // Assert
  const element = screen.getByTestId("bounceinscroll");
  expect(element).toBeInTheDocument();
  expect(screen.getByText(testContent)).toBeInTheDocument();

  return { element, ...result };
}

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
    // Arrange & Act & Assert
    renderAndAssertBounceInScroll();
  });

  it("configures viewport with custom amount when viewAmount provided", () => {
    // Arrange & Act & Assert
    renderAndAssertBounceInScroll({ viewAmount: 0.5 });
  });

  it("configures for instant animation when instant prop is true", () => {
    // Arrange & Act & Assert
    renderAndAssertBounceInScroll({ instant: true });
  });

  it("handles all viewport amount types", () => {
    // Arrange
    const amounts: Array<"some" | "all" | number> = ["some", "all", 0.7];

    amounts.forEach((amount) => {
      // Act
      const { unmount } = render(
        <BounceInScroll viewAmount={amount}>
          <div>Test content</div>
        </BounceInScroll>,
      );

      // Assert
      const element = screen.getByTestId("bounceinscroll");
      expect(element).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();

      // Cleanup
      unmount();
    });
  });
});
