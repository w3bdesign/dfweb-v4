"use client";

import { useEffect, RefObject, useState } from "react";

import "../../app/cursor.css";

interface MatrixCursorProps {
  heroRef: RefObject<HTMLElement>;
}

/**
 * MatrixCursor component that creates a matrix-style cursor effect
 * @param {MatrixCursorProps} props - The component props
 * @param {RefObject<HTMLElement>} props.heroRef - Reference to the hero section element
 * @returns {null} This component doesn't render any visible elements
 */
const MatrixCursor = ({ heroRef }: MatrixCursorProps) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const heroSection = heroRef.current;
    if (!heroSection) return;

    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    let trailElements: HTMLElement[] = [];

    const createTrailElement = (x: number, y: number) => {
      const trail = document.createElement("div");
      trail.className = "matrix-trail";
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      trail.textContent =
        matrixChars[Math.floor(Math.random() * matrixChars.length)];
      document.body.appendChild(trail);

      // Remove trail element after animation
      trail.addEventListener("animationend", () => {
        trail.remove();
      });

      return trail;
    };

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });

      // Create new trail element
      const trail = createTrailElement(e.clientX, e.clientY);
      trailElements.push(trail);

      // Limit number of trail elements
      if (trailElements.length > 20) {
        const oldTrail = trailElements.shift();
        oldTrail?.remove();
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      // Clean up trail elements
      trailElements.forEach((trail) => trail.remove());
      trailElements = [];
    };

    heroSection.addEventListener("mousemove", handleMouseMove);
    heroSection.addEventListener("mouseenter", handleMouseEnter);
    heroSection.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      heroSection.removeEventListener("mousemove", handleMouseMove);
      heroSection.removeEventListener("mouseenter", handleMouseEnter);
      heroSection.removeEventListener("mouseleave", handleMouseLeave);
      // Clean up any remaining trail elements
      trailElements.forEach((trail) => trail.remove());
    };
  }, [heroRef]);

  // Apply cursor position using style prop
  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.style.setProperty("--cursor-x", `${cursorPosition.x}px`);
      heroRef.current.style.setProperty("--cursor-y", `${cursorPosition.y}px`);
    }
  }, [cursorPosition, heroRef]);

  // Apply matrix cursor class based on hover state
  useEffect(() => {
    if (heroRef.current) {
      if (isHovered) {
        heroRef.current.classList.add("matrix-cursor");
      } else {
        heroRef.current.classList.remove("matrix-cursor");
      }
    }
  }, [isHovered, heroRef]);

  return null;
};

export default MatrixCursor;
