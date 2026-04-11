"use client";

import { useEffect, useReducer, RefObject, useCallback } from "react";
import "@/app/cursor.css";
import { useMobile } from "../../hooks/useMobile"; // Pb51b

interface MatrixCursorProps {
  heroRef: RefObject<HTMLElement | null>;
}

interface CursorStyles extends React.CSSProperties {
  "--cursor-x": string;
  "--cursor-y": string;
}

interface MatrixTrail {
  id: string;
  x: number;
  y: number;
  char: string;
}

interface CursorState {
  cursorPosition: { x: number; y: number };
  isHovered: boolean;
  trails: MatrixTrail[];
}

type CursorAction =
  | { type: "MOUSE_MOVE"; x: number; y: number; trail?: MatrixTrail }
  | { type: "MOUSE_ENTER" }
  | { type: "MOUSE_LEAVE" }
  | { type: "REMOVE_TRAIL"; trailId: string };

const MAX_TRAILS = 20;

const cursorReducer = (
  state: CursorState,
  action: CursorAction,
): CursorState => {
  switch (action.type) {
    case "MOUSE_MOVE": {
      const newPosition = { x: action.x, y: action.y };
      if (!action.trail) {
        return { ...state, cursorPosition: newPosition };
      }
      const updatedTrails = [...state.trails, action.trail];
      return {
        ...state,
        cursorPosition: newPosition,
        trails:
          updatedTrails.length > MAX_TRAILS
            ? updatedTrails.slice(1)
            : updatedTrails,
      };
    }
    case "MOUSE_ENTER":
      return { ...state, isHovered: true };
    case "MOUSE_LEAVE":
      return { ...state, isHovered: false, trails: [] };
    case "REMOVE_TRAIL":
      return {
        ...state,
        trails: state.trails.filter((trail) => trail.id !== action.trailId),
      };
  }
};

const initialState: CursorState = {
  cursorPosition: { x: 0, y: 0 },
  isHovered: false,
  trails: [],
};

/**
 * MatrixCursor component that renders a custom cursor with a matrix trail effect
 * @param {MatrixCursorProps} props - The props for the MatrixCursor component
 * @param {RefObject<HTMLElement | null>} props.heroRef - Reference to the hero section element
 * @returns {JSX.Element | null} The rendered MatrixCursor component or null if heroRef is not available
 */
const MatrixCursor = ({ heroRef }: MatrixCursorProps) => {
  const isMobile = useMobile(); // Pd528
  const [state, dispatch] = useReducer(cursorReducer, initialState);

  const getRandomChar = useCallback(() => {
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const index = array[0]! % matrixChars.length;
    return matrixChars[index] ?? matrixChars[0] ?? "X";
  }, []);

  useEffect(() => {
    const heroSection = heroRef.current;
    if (!heroSection) return;

    // Add cursor: none to the hero section when hovered
    if (state.isHovered) {
      heroSection.style.cursor = "none";
    } else {
      heroSection.style.cursor = "";
    }

    const handleMouseMove = (e: MouseEvent) => {
      const trail: MatrixTrail | undefined = state.isHovered
        ? {
            id: crypto.randomUUID(),
            x: e.clientX,
            y: e.clientY,
            char: getRandomChar(),
          }
        : undefined;

      dispatch({ type: "MOUSE_MOVE", x: e.clientX, y: e.clientY, trail });
    };

    const handleMouseEnter = () => {
      dispatch({ type: "MOUSE_ENTER" });
      heroSection.style.cursor = "none";
    };

    const handleMouseLeave = () => {
      dispatch({ type: "MOUSE_LEAVE" });
      heroSection.style.cursor = "";
    };

    heroSection.addEventListener("mousemove", handleMouseMove);
    heroSection.addEventListener("mouseenter", handleMouseEnter);
    heroSection.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      heroSection.removeEventListener("mousemove", handleMouseMove);
      heroSection.removeEventListener("mouseenter", handleMouseEnter);
      heroSection.removeEventListener("mouseleave", handleMouseLeave);
      heroSection.style.cursor = "";
    };
  }, [heroRef, state.isHovered, getRandomChar]);

  const handleAnimationEnd = useCallback((trailId: string) => {
    dispatch({ type: "REMOVE_TRAIL", trailId });
  }, []);

  if (!heroRef.current || isMobile) return null; // P6ecf

  const cursorStyles: CursorStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 9999,
    "--cursor-x": `${state.cursorPosition.x}px`,
    "--cursor-y": `${state.cursorPosition.y}px`,
  };

  return (
    <div
      data-testid="matrix-cursor"
      className={state.isHovered ? "matrix-cursor" : ""}
      style={cursorStyles}
    >
      {state.trails.map((trail) => (
        <div
          key={trail.id}
          data-testid="matrix-trail"
          className="matrix-trail"
          style={{
            position: "fixed",
            left: `${trail.x}px`,
            top: `${trail.y}px`,
            zIndex: 10000,
            pointerEvents: "none",
          }}
          onAnimationEnd={() => handleAnimationEnd(trail.id)}
        >
          {trail.char}
        </div>
      ))}
      {state.isHovered && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      )}
    </div>
  );
};

export default MatrixCursor;
