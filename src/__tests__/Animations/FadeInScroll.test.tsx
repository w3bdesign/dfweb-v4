import React from "react";
import { render, screen } from "@testing-library/react";
import FadeInScroll from "@/components/Animations/FadeInScroll.component";

type AnimationProps = {
  opacity?: number;
};

type ViewportProps = {
  once?: boolean;
  amount?: "some" | "all" | number;
};

type TransitionProps = {
  duration?: number;
  ease?: string;
};

// Capture onAnimationStart/onAnimationComplete callbacks from the mock
let capturedOnAnimationStart: (() => void) | undefined;
let capturedOnAnimationComplete: (() => void) | undefined;

jest.mock("motion/react-m", () => ({
  div: React.forwardRef(
    (
      {
        children,
        className,
        initial,
        whileInView,
        viewport,
        transition,
        style,
        "data-testid": dataTestId,
        onAnimationStart,
        onAnimationComplete,
      }: {
        children: React.ReactNode;
        className?: string;
        initial?: AnimationProps;
        whileInView?: AnimationProps;
        viewport?: ViewportProps;
        transition?: TransitionProps;
        style?: React.CSSProperties;
        "data-testid"?: string;
        onAnimationStart?: () => void;
        onAnimationComplete?: () => void;
      },
      ref: React.Ref<HTMLDivElement>,
    ) => {
      capturedOnAnimationStart = onAnimationStart;
      capturedOnAnimationComplete = onAnimationComplete;
      return (
        <div
          ref={ref}
          className={className}
          style={style}
          data-initial={JSON.stringify(initial)}
          data-while-in-view={JSON.stringify(whileInView)}
          data-viewport={JSON.stringify(viewport)}
          data-transition={JSON.stringify(transition)}
          data-testid={dataTestId}
        >
          {children}
        </div>
      );
    },
  ),
}));

describe("FadeInScroll", () => {
  beforeEach(() => {
    capturedOnAnimationStart = undefined;
    capturedOnAnimationComplete = undefined;
  });

  it("renders children correctly", () => {
    // Arrange
    render(
      <FadeInScroll>
        <div>Test content</div>
      </FadeInScroll>,
    );

    // Act
    const element = screen.getByText("Test content");

    // Assert
    expect(element).toBeInTheDocument();
  });

  it("applies custom className", () => {
    // Arrange
    render(
      <FadeInScroll className="custom-class" data-testid="fade-in-scroll">
        <div>Test content</div>
      </FadeInScroll>,
    );

    // Act
    const container = screen.getByTestId("fade-in-scroll");

    // Assert
    expect(container).toHaveClass("custom-class");
  });

  it("has initial opacity of 0", () => {
    // Arrange
    render(
      <FadeInScroll data-testid="fade-in-scroll">
        <div>Test content</div>
      </FadeInScroll>,
    );

    // Act
    const fadeInElement = screen.getByTestId("fade-in-scroll");

    // Assert
    expect(fadeInElement).toBeInTheDocument();
    expect(fadeInElement.getAttribute("data-initial")).toBe('{"opacity":0}');
  });

  it("configures viewport with custom viewAmount", () => {
    // Arrange
    render(
      <FadeInScroll viewAmount={0.5} data-testid="fade-in-scroll">
        <div>Test content</div>
      </FadeInScroll>,
    );

    // Act
    const container = screen.getByTestId("fade-in-scroll");
    const viewport = JSON.parse(
      container?.getAttribute("data-viewport") || "{}",
    );

    // Assert
    expect(viewport.once).toBe(true);
    expect(viewport.amount).toBe(0.5);
  });

  it("uses default viewAmount when not provided", () => {
    // Arrange
    render(
      <FadeInScroll data-testid="fade-in-scroll">
        <div>Test content</div>
      </FadeInScroll>,
    );

    // Act
    const container = screen.getByTestId("fade-in-scroll");
    const viewport = JSON.parse(
      container?.getAttribute("data-viewport") || "{}",
    );

    // Assert
    expect(viewport.once).toBe(true);
    expect(viewport.amount).toBe(0.2);
  });

  it("accepts custom duration", () => {
    // Arrange
    render(
      <FadeInScroll duration={0.8} data-testid="fade-in-scroll">
        <div>Test content</div>
      </FadeInScroll>,
    );

    // Act
    const container = screen.getByTestId("fade-in-scroll");
    const transition = JSON.parse(
      container?.getAttribute("data-transition") || "{}",
    );

    // Assert
    expect(transition.duration).toBe(0.8);
    expect(transition.ease).toBe("easeOut");
  });

  it("sets willChange to opacity on animation start", () => {
    // Arrange
    render(
      <FadeInScroll data-testid="fade-in-scroll">
        <div>Test content</div>
      </FadeInScroll>,
    );
    const fadeInElement = screen.getByTestId("fade-in-scroll");

    // Act
    capturedOnAnimationStart?.();

    // Assert
    expect(fadeInElement.style.willChange).toBe("opacity");
  });

  it("sets willChange to auto on animation complete", () => {
    // Arrange
    render(
      <FadeInScroll data-testid="fade-in-scroll">
        <div>Test content</div>
      </FadeInScroll>,
    );
    const fadeInElement = screen.getByTestId("fade-in-scroll");

    // Act
    capturedOnAnimationComplete?.();

    // Assert
    expect(fadeInElement.style.willChange).toBe("auto");
  });
});
