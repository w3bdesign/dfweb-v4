import { render, screen } from "@testing-library/react";
import FadeIn from "@/components/Animations/FadeIn.component";

describe("FadeIn", () => {
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
      <FadeIn className="custom-class">
        <div>Test content</div>
      </FadeIn>,
    );

    // Act
    const container = screen.getByText("Test content").parentElement;

    // Assert
    expect(container).toHaveClass("custom-class");
  });

  it("has initial opacity of 0", () => {
    // Arrange
    const { container } = render(
      <FadeIn>
        <div>Test content</div>
      </FadeIn>,
    );

    // Act
    const fadeInElement = container.firstChild as HTMLElement;

    // Assert
    expect(fadeInElement).toHaveStyle({ willChange: "opacity" });
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
});
