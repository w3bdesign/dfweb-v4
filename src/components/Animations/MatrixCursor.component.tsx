"use client";

import React, { useEffect } from "react";
import "../../app/cursor.css";

const MatrixCursor = () => {
  useEffect(() => {
    const heroSection = document.getElementById("main-hero");
    if (!heroSection) return;

    const handleMouseMove = (e: MouseEvent) => {
      heroSection.style.setProperty('--cursor-x', `${e.clientX}px`);
      heroSection.style.setProperty('--cursor-y', `${e.clientY}px`);
    };

    const handleMouseEnter = () => {
      heroSection.classList.add("matrix-cursor");
    };

    const handleMouseLeave = () => {
      heroSection.classList.remove("matrix-cursor");
    };

    heroSection.addEventListener("mousemove", handleMouseMove);
    heroSection.addEventListener("mouseenter", handleMouseEnter);
    heroSection.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      heroSection.removeEventListener("mousemove", handleMouseMove);
      heroSection.removeEventListener("mouseenter", handleMouseEnter);
      heroSection.removeEventListener("mouseleave", handleMouseLeave);
      heroSection.classList.remove("matrix-cursor");
    };
  }, []);

  return null;
};

export default MatrixCursor;
