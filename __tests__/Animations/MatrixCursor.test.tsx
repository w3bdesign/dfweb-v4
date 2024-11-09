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

    // Mock animation event
    Element.prototype.addEventListener = jest.fn((event, callback) => {
      if (event === "animationend") {
        setTimeout(() => {
          (callback as Function)();
        }, 0);
      }
    });
  });

  afterEach(() => {
    cleanup();
    // Only try to remove if it's still in the document
    if (document.getElementById("main-hero")) {
      document.body.removeChild(heroSection);
    }
    jest.clearAllMocks();
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

  test("should create trail elements on mousemove with interval", async () => {
    jest.useFakeTimers();
    render(<MatrixCursor />);

    // Initial move
    fireEvent.mouseMove(heroSection, { clientX: 100, clientY: 100 });
    expect(document.getElementsByClassName("matrix-trail").length).toBe(1);

    // Move immediately after (should not create new trail due to interval)
    fireEvent.mouseMove(heroSection, { clientX: 110, clientY: 110 });
    expect(document.getElementsByClassName("matrix-trail").length).toBe(1);

    // Advance timers and move again
    jest.advanceTimersByTime(100);
    fireEvent.mouseMove(heroSection, { clientX: 120, clientY: 120 });
    expect(document.getElementsByClassName("matrix-trail").length).toBe(2);

    jest.useRealTimers();
  });

  test("should limit the number of trail elements", async () => {
    jest.useFakeTimers();
    render(<MatrixCursor />);

    // Create more than max trail elements
    for (let i = 0; i < 25; i++) {
      jest.advanceTimersByTime(100);
      fireEvent.mouseMove(heroSection, { clientX: i * 10, clientY: i * 10 });
    }

    // Should be limited to 20 elements
    expect(
      document.getElementsByClassName("matrix-trail").length
    ).toBeLessThanOrEqual(20);

    jest.useRealTimers();
  });

  test("should cleanup trail elements on mouseleave", async () => {
    jest.useFakeTimers();
    render(<MatrixCursor />);

    // Create some trail elements
    for (let i = 0; i < 5; i++) {
      jest.advanceTimersByTime(100);
      fireEvent.mouseMove(heroSection, { clientX: i * 10, clientY: i * 10 });
    }

    expect(
      document.getElementsByClassName("matrix-trail").length
    ).toBeGreaterThan(0);

    // Leave the hero section
    fireEvent.mouseLeave(heroSection);

    // All trail elements should be removed
    expect(document.getElementsByClassName("matrix-trail").length).toBe(0);

    jest.useRealTimers();
  });
});
