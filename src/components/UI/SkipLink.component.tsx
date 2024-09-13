import React from "react";
import Button from "./Button.component";

const SkipLink: React.FC = () => {
  return (
    <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-4 focus-within:left-4 focus-within:z-50">
      <Button renderAs="a" href="#main-content">
        Hopp til hovedinnhold
      </Button>
    </div>
  );
};

export default SkipLink;
