import React, { ReactNode, ComponentType } from "react";

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
    const { className = "", animate, whileInView, initial, ...rest } = props;

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

export const div = createMotionComponent("div");
export const span = createMotionComponent("span");
export const ul = createMotionComponent("ul");
export const li = createMotionComponent("li");
export const p = createMotionComponent("p");
export const section = createMotionComponent("section");
export const nav = createMotionComponent("nav");
export const header = createMotionComponent("header");
export const footer = createMotionComponent("footer");
export const button = createMotionComponent("button");
export const a = createMotionComponent("a");
