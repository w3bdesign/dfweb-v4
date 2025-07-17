import { render, screen } from "@testing-library/react";
import Skeleton from "@/components/UI/Skeleton.component";

describe("Skeleton", () => {
  it("renders with default props", () => {
    // Arrange - Set up test data and conditions
    // No props needed for default test
    
    // Act - Perform the action being tested
    render(<Skeleton />);
    
    // Assert - Verify the results
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
    // Arrange - Set up test data and conditions
    const width = "w-32";
    const height = "h-8";
    
    // Act - Perform the action being tested
    render(<Skeleton width={width} height={height} />);

    // Assert - Verify the results
    const skeleton = screen.getByRole("generic");
    expect(skeleton).toHaveClass("w-32", "h-8");
  });

  it("renders as a circle when rounded prop is true", () => {
    // Arrange - Set up test data and conditions
    const rounded = true;
    
    // Act - Perform the action being tested
    render(<Skeleton rounded={rounded} />);

    // Assert - Verify the results
    const skeleton = screen.getByRole("generic");
    expect(skeleton).toHaveClass("rounded-full");
    expect(skeleton).not.toHaveClass("rounded");
  });

  it("applies additional className", () => {
    // Arrange - Set up test data and conditions
    const className = "mt-4";
    
    // Act - Perform the action being tested
    render(<Skeleton className={className} />);

    // Assert - Verify the results
    const skeleton = screen.getByRole("generic");
    expect(skeleton).toHaveClass("mt-4");
  });

  it("renders children with animation when provided", () => {
    // Arrange - Set up test data and conditions
    const customContent = <div data-testid="custom-content">Custom skeleton content</div>;
    
    // Act - Perform the action being tested
    render(
      <Skeleton>
        {customContent}
      </Skeleton>,
    );
    
    // Assert - Verify the results
    const wrapper = screen.getByRole("generic");
    expect(wrapper).toHaveClass("animate-pulse");
    expect(screen.getByTestId("custom-content")).toBeInTheDocument();
  });

  it("does not render the default skeleton block when children are provided", () => {
    // Arrange - Set up test data and conditions
    const customContent = <div>Custom content</div>;
    
    // Act - Perform the action being tested
    render(
      <Skeleton>
        {customContent}
      </Skeleton>,
    );
    
    // Assert - Verify the results
    const wrapper = screen.getByRole("generic");
    expect(wrapper).not.toHaveClass("bg-slate-700");
  });
});
