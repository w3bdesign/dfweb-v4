import React from "react";
import { render } from "@testing-library/react";
import RotatingLoader from "../../src/components/Animations/RotatingLoader.component";

// Mock framer-motion to avoid issues with animations in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe("RotatingLoader", () => {
  it("renders without crashing", () => {
    render(<RotatingLoader />);
  });

  it("renders the correct number of motion divs", () => {
    const { container } = render(<RotatingLoader />);
    const motionDivs = container.querySelectorAll(".bg-green-500");
    expect(motionDivs.length).toBe(4);
  });

  it("has the correct structure", () => {
    const { container } = render(<RotatingLoader />);

    // Check for the main wrapper div
    const wrapperDiv = container.firstChild;
    expect(wrapperDiv).toHaveClass("flex items-center justify-center");

    // Check for the rotating container
    const rotatingContainer = wrapperDiv.firstChild;
    expect(rotatingContainer).toHaveClass("relative h-12 w-12");

    // Check for the individual motion divs
    const motionDivs = rotatingContainer.children;
    expect(motionDivs.length).toBe(4);

    Array.from(motionDivs).forEach((div) => {
      expect(div).toHaveClass("absolute h-4 w-4 rounded-full bg-green-500");
    });
  });
});
