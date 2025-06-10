import React, { useRef } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import MatrixCursor from "@/components/Animations/MatrixCursor.component";
import { useMobile } from "@/hooks/useMobile";

// Mock useMobile hook
jest.mock("@/hooks/useMobile");
const mockUseMobile = useMobile as jest.MockedFunction<typeof useMobile>;

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
  beforeEach(() => {
    // Default to desktop view
    mockUseMobile.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should not render when heroRef is null", () => {
    // Arrange
    const NullRefWrapper = () => {
      const heroRef = useRef<HTMLDivElement>(null);
      // Don't render the div, so heroRef.current will be null
      return <MatrixCursor heroRef={heroRef} />;
    };

    // Act
    render(<NullRefWrapper />);

    // Assert
    expect(screen.queryByTestId("matrix-cursor")).not.toBeInTheDocument();
  });

  test("should not render on mobile devices", () => {
    // Arrange
    mockUseMobile.mockReturnValue(true);

    // Act
    render(<TestWrapper />);

    // Assert
    expect(screen.queryByTestId("matrix-cursor")).not.toBeInTheDocument();
  });

  test("should update cursor position and styles on mousemove", () => {
    // Arrange
    render(<TestWrapper />);
    const heroSection = screen.getByTestId("hero-section");
    const expectedPosition = { x: 100, y: 200 };

    // Act
    fireEvent.mouseEnter(heroSection);
    fireEvent.mouseMove(heroSection, {
      clientX: expectedPosition.x,
      clientY: expectedPosition.y,
    });
    const cursor = screen.getByTestId("matrix-cursor");

    // Assert
    expect(cursor.style.getPropertyValue("--cursor-x")).toBe(
      `${expectedPosition.x}px`,
    );
    expect(cursor.style.getPropertyValue("--cursor-y")).toBe(
      `${expectedPosition.y}px`,
    );
  });

  test("should add matrix-cursor class on mouseenter", () => {
    // Arrange
    render(<TestWrapper />);
    const heroSection = screen.getByTestId("hero-section");

    // Act
    fireEvent.mouseEnter(heroSection);
    const cursor = screen.getByTestId("matrix-cursor");

    // Assert
    expect(cursor).toHaveClass("matrix-cursor");
    expect(heroSection.style.cursor).toBe("none");
  });

  test("should remove matrix-cursor class on mouseleave", () => {
    // Arrange
    render(<TestWrapper />);
    const heroSection = screen.getByTestId("hero-section");

    // Act - First add the class
    fireEvent.mouseEnter(heroSection);
    const cursor = screen.getByTestId("matrix-cursor");

    // Assert initial state
    expect(cursor).toHaveClass("matrix-cursor");

    // Act - Then remove it
    fireEvent.mouseLeave(heroSection);

    // Assert final state
    expect(cursor).not.toHaveClass("matrix-cursor");
    expect(heroSection.style.cursor).toBe("");
  });

  test("should cleanup event listeners and cursor styles on unmount", () => {
    // Arrange
    const { unmount } = render(<TestWrapper />);
    const heroSection = screen.getByTestId("hero-section");

    // Act - Set initial state
    fireEvent.mouseEnter(heroSection);

    // Assert initial state
    expect(heroSection.style.cursor).toBe("none");

    // Act - Unmount component
    unmount();

    // Assert cleanup
    expect(heroSection.style.cursor).toBe("");
  });

  test("should create trail elements on mousemove when hovered", () => {
    // Arrange
    render(<TestWrapper />);
    const heroSection = screen.getByTestId("hero-section");
    const movePositions = [
      { x: 100, y: 100 },
      { x: 110, y: 110 },
      { x: 120, y: 120 },
    ];

    // Act - Enable trail creation
    fireEvent.mouseEnter(heroSection);

    // Act & Assert - Create and verify trails
    movePositions.forEach((pos, index) => {
      fireEvent.mouseMove(heroSection, { clientX: pos.x, clientY: pos.y });
      expect(screen.getAllByTestId("matrix-trail")).toHaveLength(index + 1);
    });
  });

  test("should limit the number of trail elements", () => {
    // Arrange
    render(<TestWrapper />);
    const heroSection = screen.getByTestId("hero-section");
    const maxTrails = 20;
    const totalMoves = 25;

    // Act
    fireEvent.mouseEnter(heroSection);
    for (let i = 0; i < totalMoves; i++) {
      fireEvent.mouseMove(heroSection, { clientX: i * 10, clientY: i * 10 });
    }

    // Assert
    expect(screen.getAllByTestId("matrix-trail").length).toBeLessThanOrEqual(
      maxTrails,
    );
  });

  test("should cleanup trail elements on mouseleave", () => {
    // Arrange
    render(<TestWrapper />);
    const heroSection = screen.getByTestId("hero-section");
    const trailCount = 5;

    // Act - Create trails
    fireEvent.mouseEnter(heroSection);
    for (let i = 0; i < trailCount; i++) {
      fireEvent.mouseMove(heroSection, { clientX: i * 10, clientY: i * 10 });
    }

    // Assert trails were created
    expect(screen.getAllByTestId("matrix-trail").length).toBeGreaterThan(0);

    // Act - Leave hero section
    fireEvent.mouseLeave(heroSection);

    // Assert trails were cleaned up
    expect(screen.queryAllByTestId("matrix-trail")).toHaveLength(0);
  });

  test("should remove trail element when animation ends", () => {
    // Arrange
    render(<TestWrapper />);
    const heroSection = screen.getByTestId("hero-section");

    // Act - Create trail
    fireEvent.mouseEnter(heroSection);
    fireEvent.mouseMove(heroSection, { clientX: 100, clientY: 100 });

    // Assert trail was created
    const trailElements = screen.getAllByTestId("matrix-trail");
    expect(trailElements).toHaveLength(1);

    // Act - Trigger animation end
    fireEvent.animationEnd(trailElements[0]);

    // Assert trail was removed
    expect(screen.queryAllByTestId("matrix-trail")).toHaveLength(0);
  });
});
