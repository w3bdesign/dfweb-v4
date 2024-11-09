import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import MatrixCursor from "../../src/components/Animations/MatrixCursor.component";

describe("MatrixCursor", () => {
  let heroSection: HTMLElement;
  let originalAddEventListener: typeof Element.prototype.addEventListener;

  beforeEach(() => {
    // Save original addEventListener
    originalAddEventListener = Element.prototype.addEventListener;

    // Create and append hero section to document
    heroSection = document.createElement("div");
    heroSection.id = "main-hero";
    document.body.appendChild(heroSection);

    // Only mock animationend event
    Element.prototype.addEventListener = function(type: string, listener: EventListener) {
      if (type === "animationend") {
        // Store the listener but don't actually attach it
        return;
      }
      return originalAddEventListener.apply(this, [type, listener]);
    };
  });

  afterEach(() => {
    cleanup();
    // Only try to remove if it's still in the document
    if (document.getElementById("main-hero")) {
      document.body.removeChild(heroSection);
    }
    // Restore original addEventListener
    Element.prototype.addEventListener = originalAddEventListener;
  });

  test("should update cursor position on mousemove", () => {
    render(<MatrixCursor />);

    fireEvent.mouseMove(heroSection, { clientX: 100, clientY: 200 });

    expect(heroSection.style.getPropertyValue("--cursor-x")).toBe("100px");
    expect(heroSection.style.getPropertyValue("--cursor-y")).toBe("200px");
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
    expect(heroSection.style.getPropertyValue("--cursor-x")).toBe("");
    expect(heroSection.style.getPropertyValue("--cursor-y")).toBe("");
  });

  test("should create trail elements on mousemove with interval", () => {
    render(<MatrixCursor />);

    // Initial move
    fireEvent.mouseMove(heroSection, { clientX: 100, clientY: 100 });
    expect(document.getElementsByClassName("matrix-trail").length).toBe(1);

    // Move again - should create another trail
    fireEvent.mouseMove(heroSection, { clientX: 110, clientY: 110 });
    expect(document.getElementsByClassName("matrix-trail").length).toBe(2);

    // Move again - should create another trail
    fireEvent.mouseMove(heroSection, { clientX: 120, clientY: 120 });
    expect(document.getElementsByClassName("matrix-trail").length).toBe(3);
  });

  test("should limit the number of trail elements", () => {
    render(<MatrixCursor />);

    // Create more than max trail elements
    for (let i = 0; i < 25; i++) {
      fireEvent.mouseMove(heroSection, { clientX: i * 10, clientY: i * 10 });
    }

    // Should be limited to 20 elements
    expect(
      document.getElementsByClassName("matrix-trail").length
    ).toBeLessThanOrEqual(20);
  });

  test("should cleanup trail elements on mouseleave", () => {
    render(<MatrixCursor />);

    // Create some trail elements
    for (let i = 0; i < 5; i++) {
      fireEvent.mouseMove(heroSection, { clientX: i * 10, clientY: i * 10 });
    }

    expect(
      document.getElementsByClassName("matrix-trail").length
    ).toBeGreaterThan(0);

    // Leave the hero section
    fireEvent.mouseLeave(heroSection);

    // All trail elements should be removed
    expect(document.getElementsByClassName("matrix-trail").length).toBe(0);
  });
});
