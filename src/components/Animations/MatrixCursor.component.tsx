"use client";

import { useEffect, RefObject, useState, useCallback } from "react";
import "@/app/cursor.css";
import { useMobile } from "../../hooks/useMobile";

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

/**
 * MatrixCursor component that renders a custom cursor with a matrix trail effect
 * @param {MatrixCursorProps} props - The props for the MatrixCursor component
 * @param {RefObject<HTMLElement | null>} props.heroRef - Reference to the hero section element
 * @returns {JSX.Element | null} The rendered MatrixCursor component or null if heroRef is not available
 */
const MatrixCursor = ({ heroRef }: MatrixCursorProps) => {
  const isMobile = useMobile();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [trails, setTrails] = useState<MatrixTrail[]>([]);

  const getRandomChar = useCallback(() => {
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const index = Math.floor(Math.random() * matrixChars.length);
    return matrixChars[index] ?? "X";
  }, []);

  const createTrail = useCallback(
    (x: number, y: number) => {
      const newTrail: MatrixTrail = {
        id: Math.random().toString(36).substring(2, 100),
        x,
        y,
        char: getRandomChar(),
      };

      setTrails((currentTrails) => {
        const updatedTrails = [...currentTrails, newTrail];
        if (updatedTrails.length > 20) {
          return updatedTrails.slice(1);
        }
        return updatedTrails;
      });
    },
    [getRandomChar]
  );

  useEffect(() => {
    const heroSection = heroRef.current;
    if (!heroSection) return;

    if (isHovered) {
      heroSection.style.cursor = "none";
    } else {
      heroSection.style.cursor = "";
    }

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });

      if (isHovered) {
        createTrail(e.clientX, e.clientY);
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      heroSection.style.cursor = "none";
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      heroSection.style.cursor = "";
      setTrails([]);
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
  }, [heroRef, isHovered, createTrail]);

  const handleAnimationEnd = useCallback((trailId: string) => {
    setTrails((currentTrails) =>
      currentTrails.filter((trail) => trail.id !== trailId),
    );
  }, []);

  if (!heroRef.current || isMobile) return null;

  const cursorStyles: CursorStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 9999,
    "--cursor-x": `${cursorPosition.x}px`,
    "--cursor-y": `${cursorPosition.y}px`,
  };

  return (
    <div
      data-testid="matrix-cursor"
      className={isHovered ? "matrix-cursor" : ""}
      style={cursorStyles}
    >
      {trails.map((trail) => (
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
      {isHovered && (
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
