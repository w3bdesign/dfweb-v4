import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import Pill from "../../src/components/UI/Pill.component";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("Pill Component", () => {
  it("renders with default props", () => {
    render(<Pill text="Test Pill" />);
    const pill = screen.getByText("Test Pill");
    expect(pill).toBeInTheDocument();
    expect(pill.tagName).toBe("BUTTON");
    expect(pill).toHaveAttribute("data-text", "Test Pill");
  });

  it("renders as a link when href is provided", () => {
    render(<Pill text="Link Pill" href="/test" />);
    const pill = screen.getByText("Link Pill");
    expect(pill).toBeInTheDocument();
    expect(pill.tagName).toBe("A");
    expect(pill).toHaveAttribute("href", "/test");
    expect(pill).toHaveAttribute("data-text", "Link Pill");
  });

  it("applies custom className", () => {
    render(<Pill text="Custom Class" className="custom-class" />);
    const pill = screen.getByText("Custom Class");
    expect(pill).toHaveClass("custom-class");
  });

  it("calls onClick function when clicked", () => {
    const mockOnClick = jest.fn();
    render(<Pill text="Clickable Pill" onClick={mockOnClick} />);
    const pill = screen.getByText("Clickable Pill");
    fireEvent.click(pill);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders with correct base classes", () => {
    render(<Pill text="Base Classes" />);
    const pill = screen.getByText("Base Classes");
    expect(pill).toHaveClass(
      "glitch",
      "text-white",
      "m-4",
      "text-xl",
      "p-6",
      "mt-4",
      "rounded-full",
      "transition",
      "duration-300",
      "ease-in-out",
      "transform",
      "bg-blue-600",
      "bg-opacity-20",
      "border-2",
      "border-blue-800",
      "border-opacity-30",
      "hover:bg-blue-400",
      "hover:bg-opacity-30",
      "backdrop-blur-sm"
    );
  });

  it("renders as a button when no href is provided", () => {
    render(<Pill text="Button Pill" onClick={() => {}} />);
    const pill = screen.getByText("Button Pill");
    expect(pill.tagName).toBe("BUTTON");
  });

  it("does not call onClick when rendered as a link", () => {
    const mockOnClick = jest.fn();
    render(<Pill text="Link Pill" href="/test" onClick={mockOnClick} />);
    const pill = screen.getByText("Link Pill");
    fireEvent.click(pill);
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
