import React, { ReactNode, ComponentType } from "react";

/**
 * This mocks the 'motion/react' module for Ladle stories
 */

// Define types for the motion component props
type MotionProps = {
  children?: ReactNode;
  className?: string;
  animate?: string | Record<string, unknown>;
  initial?: string | Record<string, unknown>;
  variants?: Record<string, unknown>;
  whileInView?: string | Record<string, unknown>;
  viewport?: Record<string, unknown>;
  [key: string]: unknown;
};

const createMotionComponent = (
  component = "div",
): ComponentType<MotionProps> => {
  const MotionComponent: React.FC<MotionProps> = ({ children, ...props }) => {
    // Extract the className from variants if present
    const {
      className = "",
      animate,
      whileInView,
      initial,
      ...rest
    } = props;

    // Add a class to indicate this is a mocked motion component
    const combinedClassName = `${className} mock-motion-component`;

    return React.createElement(
      component,
      {
        ...rest,
        className: combinedClassName,
        "data-mock-motion": true,
        "data-mock-initial": initial,
        "data-mock-animate": animate,
        "data-mock-while-in-view": whileInView,
      },
      children,
    );
  };

  return MotionComponent;
};

// Export the mock components
export const motion = {
  div: createMotionComponent("div"),
  span: createMotionComponent("span"),
  ul: createMotionComponent("ul"),
  li: createMotionComponent("li"),
  p: createMotionComponent("p"),
  section: createMotionComponent("section"),
  nav: createMotionComponent("nav"),
  header: createMotionComponent("header"),
  footer: createMotionComponent("footer"),
  button: createMotionComponent("button"),
  a: createMotionComponent("a"),
};

export const AnimatePresence: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  return React.createElement(React.Fragment, null, children);
};

// Basic animations for use in stories
export const useAnimation = () => ({
  start: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  set: () => {},
});

// Mock variants for animations
export type Variants = Record<string, Record<string, unknown>>;

const motionMock = { motion, AnimatePresence, useAnimation };
export default motionMock;
