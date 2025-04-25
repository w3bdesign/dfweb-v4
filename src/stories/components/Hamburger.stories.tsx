import React, { useState } from "react";
import { Meta } from "@ladle/react";
import Hamburger from "../../components/Layout/Hamburger.component";

export default {
  title: "Layout/Hamburger",
  component: Hamburger,
} as Meta;

// Default hamburger state
export const Default = () => (
  <div className="bg-gray-800 p-4">
    <Hamburger onClick={() => {}} animatetoX={false} />
  </div>
);

// X state
export const XState = () => (
  <div className="bg-gray-800 p-4">
    <Hamburger onClick={() => {}} animatetoX={true} />
  </div>
);

// Interactive state
export const Interactive = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 p-4">
      <Hamburger onClick={() => setIsOpen(!isOpen)} animatetoX={isOpen} />
      <p className="text-white text-sm mt-4">
        Click the hamburger to toggle state
      </p>
    </div>
  );
};

// On dark background
export const OnDarkBackground = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-900 p-4">
      <Hamburger onClick={() => setIsOpen(!isOpen)} animatetoX={isOpen} />
    </div>
  );
};

// On light background
export const OnLightBackground = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-100 p-4">
      <div className="bg-gray-800 inline-block rounded-sm">
        <Hamburger onClick={() => setIsOpen(!isOpen)} animatetoX={isOpen} />
      </div>
    </div>
  );
};
