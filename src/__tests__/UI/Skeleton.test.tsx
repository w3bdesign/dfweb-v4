import { render, screen } from "@testing-library/react";
import Skeleton from "@/components/UI/Skeleton.component";

describe("Skeleton", () => {
  it("renders with default props", () => {
    // Arrange
    render(<Skeleton />);

    // Act
    const skeleton = screen.getByTestId("skeleton");

    // Assert
    expect(skeleton).toHaveClass(
      "skeleton-shimmer",
      "bg-slate-700",
      "rounded",
      "w-full",
      "h-4",
    );
  });

  it("renders with custom props", () => {
    // Arrange
    render(
      <Skeleton
        width="w-1/2"
        height="h-8"
        className="custom-class"
        rounded
        shimmer={false}
      />,
    );

    // Act
    const skeleton = screen.getByTestId("skeleton");

    // Assert
    expect(skeleton).toHaveClass(
      "animate-pulse",
      "bg-slate-700",
      "rounded-full",
      "w-1/2",
      "h-8",
      "custom-class",
    );
  });

  it("renders children when provided", () => {
    // Arrange
    render(
      <Skeleton data-testid="skeleton">
        <div>Child content</div>
      </Skeleton>,
    );

    // Act
    const child = screen.getByText("Child content");
    const skeleton = screen.getByTestId("skeleton");

    // Assert
    expect(child).toBeInTheDocument();
    expect(skeleton).toHaveClass("animate-pulse");
  });
});
