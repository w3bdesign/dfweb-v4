import { render, screen } from "@testing-library/react";
import Skeleton from "@/components/UI/Skeleton.component";

describe("Skeleton", () => {
  it("renders with default props", () => {
    // Arrange & Act
    render(<Skeleton />);

    // Assert
    const skeleton = screen.getByRole("generic");
    expect(skeleton).toHaveClass(
      "animate-pulse",
      "bg-slate-700",
      "rounded",
      "w-full",
      "h-4",
    );
  });

  it("renders with custom width and height", () => {
    // Arrange & Act
    render(<Skeleton width="w-32" height="h-8" />);

    // Assert
    const skeleton = screen.getByRole("generic");
    expect(skeleton).toHaveClass("w-32", "h-8");
  });

  it("renders as a circle when rounded prop is true", () => {
    // Arrange & Act
    render(<Skeleton rounded />);

    // Assert
    const skeleton = screen.getByRole("generic");
    expect(skeleton).toHaveClass("rounded-full");
    expect(skeleton).not.toHaveClass("rounded");
  });

  it("applies additional className", () => {
    // Arrange & Act
    render(<Skeleton className="mt-4" />);

    // Assert
    const skeleton = screen.getByRole("generic");
    expect(skeleton).toHaveClass("mt-4");
  });

  it("renders children with animation when provided", () => {
    // Arrange & Act
    render(
      <Skeleton>
        <div data-testid="custom-content">Custom skeleton content</div>
      </Skeleton>,
    );

    // Assert
    const wrapper = screen.getByRole("generic");
    expect(wrapper).toHaveClass("animate-pulse");
    expect(screen.getByTestId("custom-content")).toBeInTheDocument();
  });

  it("does not render the default skeleton block when children are provided", () => {
    // Arrange & Act
    render(
      <Skeleton>
        <div>Custom content</div>
      </Skeleton>,
    );

    // Assert
    const wrapper = screen.getByRole("generic");
    expect(wrapper).not.toHaveClass("bg-slate-700");
  });
});
