import React, { useRef } from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import MatrixCursor from "../../src/components/Animations/MatrixCursor.component";

// Wrapper component to provide ref
const TestWrapper = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={heroRef} data-testid="hero-section" />
      <MatrixCursor heroRef={heroRef} />
    </>
  );
};

describe("MatrixCursor", () => {
  afterEach(cleanup);

  test("should update cursor position and styles on mousemove", () => {
    const { getByTestId } = render(<TestWrapper />);
    const heroSection = getByTestId("hero-section");

    // First enter to enable cursor
    fireEvent.mouseEnter(heroSection);

    fireEvent.mouseMove(heroSection, { clientX: 100, clientY: 200 });

    const cursor = getByTestId("matrix-cursor");
    expect(cursor.style.getPropertyValue("--cursor-x")).toBe("100px");
    expect(cursor.style.getPropertyValue("--cursor-y")).toBe("200px");
  });

  test("should add matrix-cursor class on mouseenter", () => {
    const { getByTestId } = render(<TestWrapper />);
    const heroSection = getByTestId("hero-section");

    fireEvent.mouseEnter(heroSection);

    const cursor = getByTestId("matrix-cursor");
    expect(cursor).toHaveClass("matrix-cursor");
    expect(heroSection.style.cursor).toBe("none");
  });

  test("should remove matrix-cursor class on mouseleave", () => {
    const { getByTestId } = render(<TestWrapper />);
    const heroSection = getByTestId("hero-section");

    // First add the class
    fireEvent.mouseEnter(heroSection);
    const cursor = getByTestId("matrix-cursor");
    expect(cursor).toHaveClass("matrix-cursor");

    // Then remove it
    fireEvent.mouseLeave(heroSection);
    expect(cursor).not.toHaveClass("matrix-cursor");
    expect(heroSection.style.cursor).toBe("");
  });

  test("should cleanup event listeners and cursor styles on unmount", () => {
    const { getByTestId, unmount } = render(<TestWrapper />);
    const heroSection = getByTestId("hero-section");

    // Add cursor style first
    fireEvent.mouseEnter(heroSection);
    expect(heroSection.style.cursor).toBe("none");

    // Unmount and verify cleanup
    unmount();
    expect(heroSection.style.cursor).toBe("");
  });

  test("should create trail elements on mousemove when hovered", () => {
    const { getByTestId, container } = render(<TestWrapper />);
    const heroSection = getByTestId("hero-section");

    // First enter to enable trail creation
    fireEvent.mouseEnter(heroSection);

    // Move to create trails
    fireEvent.mouseMove(heroSection, { clientX: 100, clientY: 100 });
    expect(container.getElementsByClassName("matrix-trail").length).toBe(1);

    fireEvent.mouseMove(heroSection, { clientX: 110, clientY: 110 });
    expect(container.getElementsByClassName("matrix-trail").length).toBe(2);

    fireEvent.mouseMove(heroSection, { clientX: 120, clientY: 120 });
    expect(container.getElementsByClassName("matrix-trail").length).toBe(3);
  });

  test("should limit the number of trail elements", () => {
    const { getByTestId, container } = render(<TestWrapper />);
    const heroSection = getByTestId("hero-section");

    // First enter to enable trail creation
    fireEvent.mouseEnter(heroSection);

    // Create more than max trail elements
    for (let i = 0; i < 25; i++) {
      fireEvent.mouseMove(heroSection, { clientX: i * 10, clientY: i * 10 });
    }

    // Should be limited to 20 elements
    expect(
      container.getElementsByClassName("matrix-trail").length,
    ).toBeLessThanOrEqual(20);
  });

  test("should cleanup trail elements on mouseleave", () => {
    const { getByTestId, container } = render(<TestWrapper />);
    const heroSection = getByTestId("hero-section");

    // First enter to enable trail creation
    fireEvent.mouseEnter(heroSection);

    // Create some trail elements
    for (let i = 0; i < 5; i++) {
      fireEvent.mouseMove(heroSection, { clientX: i * 10, clientY: i * 10 });
    }

    expect(
      container.getElementsByClassName("matrix-trail").length,
    ).toBeGreaterThan(0);

    // Leave the hero section
    fireEvent.mouseLeave(heroSection);

    // All trail elements should be removed
    expect(container.getElementsByClassName("matrix-trail").length).toBe(0);
  });

  test("should remove trail element when animation ends", () => {
    const { getByTestId, container } = render(<TestWrapper />);
    const heroSection = getByTestId("hero-section");

    // First enter to enable trail creation
    fireEvent.mouseEnter(heroSection);

    // Create a trail element
    fireEvent.mouseMove(heroSection, { clientX: 100, clientY: 100 });

    const trailElements = container.getElementsByClassName("matrix-trail");
    expect(trailElements.length).toBe(1);

    // Get the trail element and trigger animationend
    const trailElement = trailElements[0];
    fireEvent.animationEnd(trailElement);

    // Verify the trail element was removed
    expect(container.getElementsByClassName("matrix-trail").length).toBe(0);
  });
});
