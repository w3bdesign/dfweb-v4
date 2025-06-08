import React from "react";
import { Meta } from "@ladle/react";
import Pill from "@/components/UI/Pill.component";
import "@/app/globals.css";

export default {
  title: "UI/Pill",
  component: Pill,
} as Meta;

// Default pill as button
export const DefaultButton = () => <Pill text="Click Me" />;

// Pill with custom class
export const CustomClass = () => (
  <Pill
    text="Custom Styling"
    className="bg-purple-600 bg-opacity-20 border-purple-800"
  />
);

// Pill as link
export const AsLink = () => (
  <Pill text="Go to Example" href="https://example.com" />
);

// Multiple pills
export const MultiplePills = () => (
  <div className="flex flex-wrap justify-center">
    <Pill text="React" />
    <Pill text="TypeScript" />
    <Pill text="Next.js" />
    <Pill text="Tailwind CSS" />
  </div>
);

// With click handler
export const WithClickHandler = () => {
  const [clickCount, setClickCount] = React.useState(0);

  return (
    <div className="flex flex-col items-center">
      <Pill
        text={`Clicked ${clickCount} times`}
        onClick={() => setClickCount(clickCount + 1)}
      />
      {clickCount > 0 && (
        <div className="mt-4 text-white">
          You clicked me {clickCount} time{clickCount !== 1 && "s"}!
        </div>
      )}
    </div>
  );
};

// Different sizes using className
export const Sizes = () => (
  <div className="space-y-4 flex flex-col items-center">
    <Pill text="Small Pill" className="text-sm p-4" />
    <Pill text="Default Size" />
    <Pill text="Large Pill" className="text-2xl p-8" />
  </div>
);

// Different colors
export const Colors = () => (
  <div className="space-y-4 flex flex-col items-center">
    <Pill text="Blue (Default)" />
    <Pill
      text="Green"
      className="bg-green-600 bg-opacity-20 border-green-800 border-opacity-30
                hover:bg-green-400 hover:bg-opacity-30
                hover:shadow-[0_0_15px_rgba(0,255,0,0.1),0_0_20px_rgba(0,255,0,0.1),inset_0_0_20px_rgba(0,255,0,0.1)]"
    />
    <Pill
      text="Red"
      className="bg-red-600 bg-opacity-20 border-red-800 border-opacity-30
                hover:bg-red-400 hover:bg-opacity-30
                hover:shadow-[0_0_15px_rgba(255,0,0,0.1),0_0_20px_rgba(255,0,0,0.1),inset_0_0_20px_rgba(255,0,0,0.1)]"
    />
    <Pill
      text="Purple"
      className="bg-purple-600 bg-opacity-20 border-purple-800 border-opacity-30
                hover:bg-purple-400 hover:bg-opacity-30
                hover:shadow-[0_0_15px_rgba(128,0,128,0.1),0_0_20px_rgba(128,0,128,0.1),inset_0_0_20px_rgba(128,0,128,0.1)]"
    />
  </div>
);
