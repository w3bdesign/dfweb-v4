import { render, screen } from "@testing-library/react";
import Skeleton from "@/components/UI/Skeleton.component";

describe("Skeleton", () => {
  it("renders with default props", () => {
    render(<Skeleton />);
    const skeleton = screen.getByRole("generic");
    expect(skeleton).toHaveClass(
      "animate-pulse",
      "bg-slate-700",
      "rounded",
      "w-full",
      "h-4"
    );
  });

  it("renders with custom width and height", () => {
    render(<Skeleton width="w-32" height="h-8" />);
    const skeleton = screen.getByRole("generic");
    expect(skeleton).toHaveClass("w-32", "h-8");
  });

  it("renders as a circle when rounded prop is true", () => {
    render(<Skeleton rounded />);
    const skeleton = screen.getByRole("generic");
    expect(skeleton).toHaveClass("rounded-full");
    expect(skeleton).not.toHaveClass("rounded");
  });

  it("applies additional className", () => {
    render(<Skeleton className="mt-4" />);
    const skeleton = screen.getByRole("generic");
    expect(skeleton).toHaveClass("mt-4");
  });

  it("renders children with animation when provided", () => {
    render(
      <Skeleton>
        <div data-testid="custom-content">Custom skeleton content</div>
      </Skeleton>
    );
    const wrapper = screen.getByRole("generic");
    expect(wrapper).toHaveClass("animate-pulse");
    expect(screen.getByTestId("custom-content")).toBeInTheDocument();
  });

  it("does not render the default skeleton block when children are provided", () => {
    render(
      <Skeleton>
        <div>Custom content</div>
      </Skeleton>
    );
    const wrapper = screen.getByRole("generic");
    expect(wrapper).not.toHaveClass("bg-slate-700");
  });
});
