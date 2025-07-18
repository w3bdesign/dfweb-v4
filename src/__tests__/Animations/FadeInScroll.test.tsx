import { render, screen } from "@testing-library/react";
import FadeInScroll from "@/components/Animations/FadeInScroll.component";
import React from "react";

type MotionStyle = React.CSSProperties & {
  willChange?: string;
};

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

// Mock framer-motion
jest.mock("motion/react", () => ({
  motion: {
    div: ({
      children,
      className,
      initial,
      whileInView,
      viewport,
      transition,
      style,
    }: {
      children: React.ReactNode;
      className?: string;
      initial?: AnimationProps;
      whileInView?: AnimationProps;
      viewport?: ViewportProps;
      transition?: TransitionProps;
      style?: MotionStyle;
    }) => {
      // Store props in data attributes for testing
      return (
        <div
          className={className}
          style={style}
          data-initial={JSON.stringify(initial)}
          data-while-in-view={JSON.stringify(whileInView)}
          data-viewport={JSON.stringify(viewport)}
          data-transition={JSON.stringify(transition)}
        >
          {children}
        </div>
      );
    },
  },
}));

describe("FadeInScroll", () => {
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
      <FadeInScroll className="custom-class">
        <div>Test content</div>
      </FadeInScroll>,
    );

    // Act
    const container = screen.getByText("Test content").parentElement;

    // Assert
    expect(container).toHaveClass("custom-class");
  });

  it("has initial opacity of 0", () => {
    // Arrange
    const { container } = render(
      <FadeInScroll>
        <div>Test content</div>
      </FadeInScroll>,
    );

    // Act
    const fadeInElement = container.firstChild as HTMLElement;

    // Assert
    expect(fadeInElement).toHaveStyle({ willChange: "opacity" });
    expect(fadeInElement.getAttribute("data-initial")).toBe('{"opacity":0}');
  });

  it("configures viewport with custom viewAmount", () => {
    // Arrange
    render(
      <FadeInScroll viewAmount={0.5}>
        <div>Test content</div>
      </FadeInScroll>,
    );

    // Act
    const container = screen.getByText("Test content").parentElement;
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
      <FadeInScroll>
        <div>Test content</div>
      </FadeInScroll>,
    );

    // Act
    const container = screen.getByText("Test content").parentElement;
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
      <FadeInScroll duration={0.8}>
        <div>Test content</div>
      </FadeInScroll>,
    );

    // Act
    const container = screen.getByText("Test content").parentElement;
    const transition = JSON.parse(
      container?.getAttribute("data-transition") || "{}",
    );

    // Assert
    expect(transition.duration).toBe(0.8);
    expect(transition.ease).toBe("easeOut");
  });
});
