import React from "react";
import { render, screen } from "@testing-library/react";
import FadeIn from "@/components/Animations/FadeIn.component";

// Capture onAnimationStart/onAnimationComplete callbacks from the mock
let capturedOnAnimationStart: (() => void) | undefined;
let capturedOnAnimationComplete: (() => void) | undefined;

jest.mock("motion/react-m", () => ({
  div: React.forwardRef(
    (
      {
        children,
        className,
        "data-testid": dataTestId,
        onAnimationStart,
        onAnimationComplete,
      }: {
        children?: React.ReactNode;
        className?: string;
        "data-testid"?: string;
        onAnimationStart?: () => void;
        onAnimationComplete?: () => void;
      },
      ref: React.Ref<HTMLDivElement>,
    ) => {
      capturedOnAnimationStart = onAnimationStart;
      capturedOnAnimationComplete = onAnimationComplete;
      return (
        <div ref={ref} className={className} data-testid={dataTestId}>
          {children}
        </div>
      );
    },
  ),
}));

describe("FadeIn", () => {
  beforeEach(() => {
    capturedOnAnimationStart = undefined;
    capturedOnAnimationComplete = undefined;
  });

  it("renders children correctly", () => {
    // Arrange
    render(
      <FadeIn>
        <div>Test content</div>
      </FadeIn>,
    );

    // Act
    const element = screen.getByText("Test content");

    // Assert
    expect(element).toBeInTheDocument();
  });

  it("applies custom className", () => {
    // Arrange
    render(
      <FadeIn className="custom-class" data-testid="fade-in">
        <div>Test content</div>
      </FadeIn>,
    );

    // Act
    const container = screen.getByTestId("fade-in");

    // Assert
    expect(container).toHaveClass("custom-class");
  });

  it("has initial opacity of 0", () => {
    // Arrange
    render(
      <FadeIn data-testid="fade-in">
        <div>Test content</div>
      </FadeIn>,
    );

    // Act
    const fadeInElement = screen.getByTestId("fade-in");

    // Assert
    expect(fadeInElement).toBeInTheDocument();
  });

  it("accepts custom duration", () => {
    // Arrange
    render(
      <FadeIn duration={0.5}>
        <div>Test content</div>
      </FadeIn>,
    );

    // Act
    const element = screen.getByText("Test content");

    // Assert
    expect(element).toBeInTheDocument();
  });

  it("accepts custom delay", () => {
    // Arrange
    render(
      <FadeIn delay={0.2}>
        <div>Test content</div>
      </FadeIn>,
    );

    // Act
    const element = screen.getByText("Test content");

    // Assert
    expect(element).toBeInTheDocument();
  });

  it("sets willChange to opacity on animation start", () => {
    // Arrange
    render(
      <FadeIn data-testid="fade-in">
        <div>Test content</div>
      </FadeIn>,
    );
    const fadeInElement = screen.getByTestId("fade-in");

    // Act
    capturedOnAnimationStart?.();

    // Assert
    expect(fadeInElement.style.willChange).toBe("opacity");
  });

  it("sets willChange to auto on animation complete", () => {
    // Arrange
    render(
      <FadeIn data-testid="fade-in">
        <div>Test content</div>
      </FadeIn>,
    );
    const fadeInElement = screen.getByTestId("fade-in");

    // Act
    capturedOnAnimationComplete?.();

    // Assert
    expect(fadeInElement.style.willChange).toBe("auto");
  });
});
