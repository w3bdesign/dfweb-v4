import React from "react";
import { Meta } from "@ladle/react";
import Icons from "@/components/Index/Icons.component";
import "@/app/globals.css";

export default {
  title: "Index/Icons",
  component: Icons,
} as Meta;

// Default icons component
export const Default = () => <Icons />;

// Icons on a dark background
export const OnDarkBackground = () => (
  <div className="bg-gray-900 p-8 rounded-lg">
    <Icons />
  </div>
);

// Icons on a light background
export const OnLightBackground = () => (
  <div className="bg-gray-100 p-8 rounded-lg">
    <Icons />
  </div>
);

// Icons in a narrow container to test responsiveness
export const NarrowContainer = () => (
  <div className="max-w-xs mx-auto bg-gray-800 p-4 rounded-lg">
    <Icons />
  </div>
);

// Icons with matrix-like background
export const WithMatrixBackground = () => (
  <div
    className="p-8 rounded-lg relative overflow-hidden"
    style={{
      background:
        "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://raw.githubusercontent.com/kbrsh/moon/gh-pages/img/bg-1.png')",
    }}
  >
    <Icons />
  </div>
);

// Icons in grid layout
export const InGridLayout = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-gray-900 p-4 rounded-lg">
      <h3 className="text-white text-center mb-4">React & TypeScript</h3>
      <Icons />
    </div>
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white text-center mb-4">Skills & Tools</h3>
      <Icons />
    </div>
  </div>
);
