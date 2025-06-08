/**
 * Mock for @/lib/framer/client module for use in Ladle stories
 */

import React from "react";

// Create mock components that just render the standard HTML elements
export const MotionDiv: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return React.createElement(
    "div",
    {
      ...props,
      "data-framer-mock": "MotionDiv",
    },
    children,
  );
};

export const MotionLi: React.FC<React.HTMLAttributes<HTMLLIElement>> = ({
  children,
  ...props
}) => {
  return React.createElement(
    "li",
    {
      ...props,
      "data-framer-mock": "MotionLi",
    },
    children,
  );
};

export const MotionUl: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({
  children,
  ...props
}) => {
  return React.createElement(
    "ul",
    {
      ...props,
      "data-framer-mock": "MotionUl",
    },
    children,
  );
};
