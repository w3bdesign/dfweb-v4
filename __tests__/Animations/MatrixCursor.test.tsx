import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import MatrixCursor from "../../src/components/Animations/MatrixCursor.component";

describe("MatrixCursor", () => {
  let heroSection: HTMLElement;

  beforeEach(() => {
    // Create and append hero section to document
    heroSection = document.createElement("div");
    heroSection.id = "main-hero";
    document.body.appendChild(heroSection);
  });

  afterEach(() => {
    cleanup();
    // Only try to remove if it's still in the document
    if (document.getElementById("main-hero")) {
      document.body.removeChild(heroSection);
    }
  });

  test("should update cursor position on mousemove", () => {
    render(<MatrixCursor />);
    
    fireEvent.mouseMove(heroSection, { clientX: 100, clientY: 200 });
    
    expect(heroSection.style.getPropertyValue("--cursor-x")).toEqual("100px");
    expect(heroSection.style.getPropertyValue("--cursor-y")).toEqual("200px");
  });

  test("should add matrix-cursor class on mouseenter", () => {
    render(<MatrixCursor />);
    
    fireEvent.mouseEnter(heroSection);
    
    expect(heroSection).toHaveClass("matrix-cursor");
  });

  test("should remove matrix-cursor class on mouseleave", () => {
    render(<MatrixCursor />);
    
    // First add the class
    fireEvent.mouseEnter(heroSection);
    expect(heroSection).toHaveClass("matrix-cursor");
    
    // Then remove it
    fireEvent.mouseLeave(heroSection);
    expect(heroSection).not.toHaveClass("matrix-cursor");
  });

  test("should do nothing if hero section is not found", () => {
    // Remove hero section before test
    document.body.removeChild(heroSection);
    
    const { rerender } = render(<MatrixCursor />);
    
    // Should not throw any errors
    expect(() => rerender(<MatrixCursor />)).not.toThrow();
  });

  test("should cleanup event listeners and classes on unmount", () => {
    const { unmount } = render(<MatrixCursor />);
    
    // Add the class first
    fireEvent.mouseEnter(heroSection);
    expect(heroSection).toHaveClass("matrix-cursor");
    
    // Unmount and verify cleanup
    unmount();
    expect(heroSection).not.toHaveClass("matrix-cursor");
    
    // Verify events are cleaned up by checking if they still work
    fireEvent.mouseMove(heroSection, { clientX: 100, clientY: 200 });
    expect(heroSection.style.getPropertyValue("--cursor-x")).toEqual("");
    expect(heroSection.style.getPropertyValue("--cursor-y")).toEqual("");
  });
});
