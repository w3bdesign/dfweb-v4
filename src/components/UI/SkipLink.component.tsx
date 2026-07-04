"use client";

import React from "react";
import Button from "./Button.component";

const SkipLink: React.FC = () => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-4 focus-within:left-4 focus-within:z-50">
      <Button
        renderAs="a"
        href="#main-content"
        onClick={handleClick as never}
      >
        Hopp til hovedinnhold
      </Button>
    </div>
  );
};

export default SkipLink;
