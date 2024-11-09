"use client";

import React, { useEffect } from "react";
import "../../app/cursor.css";

const MatrixCursor = () => {
  useEffect(() => {
    const heroSection = document.getElementById("main-hero");
    if (!heroSection) return;

    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    let trailElements: HTMLElement[] = [];

    const createTrailElement = (x: number, y: number) => {
      const trail = document.createElement("div");
      trail.className = "matrix-trail";
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      trail.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      document.body.appendChild(trail);
      
      // Remove trail element after animation
      trail.addEventListener("animationend", () => {
        trail.remove();
      });

      return trail;
    };

    const handleMouseMove = (e: MouseEvent) => {
      heroSection.style.setProperty('--cursor-x', `${e.clientX}px`);
      heroSection.style.setProperty('--cursor-y', `${e.clientY}px`);

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
      heroSection.classList.add("matrix-cursor");
    };

    const handleMouseLeave = () => {
      heroSection.classList.remove("matrix-cursor");
      // Clean up trail elements
      trailElements.forEach(trail => trail.remove());
      trailElements = [];
    };

    heroSection.addEventListener("mousemove", handleMouseMove);
    heroSection.addEventListener("mouseenter", handleMouseEnter);
    heroSection.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      heroSection.removeEventListener("mousemove", handleMouseMove);
      heroSection.removeEventListener("mouseenter", handleMouseEnter);
      heroSection.removeEventListener("mouseleave", handleMouseLeave);
      heroSection.classList.remove("matrix-cursor");
      // Clean up any remaining trail elements
      trailElements.forEach(trail => trail.remove());
    };
  }, []);

  return null;
};

export default MatrixCursor;
