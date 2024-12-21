import React from "react";
import { Meta } from "@ladle/react";
import "../../app/glitch.css";

// Mock NavigationLink component for stories
const NavigationLink = ({
  name,
  href,
  isActive,
}: {
  name: string;
  href: string;
  isActive: boolean;
}) => (
  <div className="relative">
    <a
      href={href}
      onClick={(e) => e.preventDefault()}
      className={`flex w-full items-center justify-center px-2 py-2 hover:text-white transition font-semibold text-lg ${
        isActive ? "text-green-400" : ""
      }`}
    >
      <div className="glitch relative" data-text={name}>
        {name}
        <span
          className={`absolute bottom-0 left-0 h-0.5 bg-current ${
            isActive ? "bg-green-400" : "bg-white"
          }`}
          style={{
            width: isActive ? "100%" : "0%",
            transition: "width 0.3s",
          }}
        />
      </div>
    </a>
  </div>
);

export default {
  title: "Layout/NavigationLink",
  component: NavigationLink,
} as Meta;

// Default state
export const Default = () => (
  <div className="bg-gray-800 p-4 w-48">
    <NavigationLink name="Home" href="/" isActive={false} />
  </div>
);

// Active state
export const Active = () => (
  <div className="bg-gray-800 p-4 w-48">
    <NavigationLink name="Home" href="/" isActive={true} />
  </div>
);

// Multiple links
export const MultipleLinks = () => (
  <div className="bg-gray-800 p-4 w-48 flex flex-col gap-2">
    <NavigationLink name="Home" href="/" isActive={true} />
    <NavigationLink name="Projects" href="/projects" isActive={false} />
    <NavigationLink name="Contact" href="/contact" isActive={false} />
  </div>
);

// Long text
export const LongText = () => (
  <div className="bg-gray-800 p-4 w-64">
    <NavigationLink
      name="Very Long Navigation Link Text"
      href="/long"
      isActive={false}
    />
  </div>
);

// Different backgrounds
export const OnDifferentBackgrounds = () => (
  <div className="space-y-4">
    <div className="bg-gray-900 p-4 w-48">
      <NavigationLink name="Dark Background" href="/" isActive={false} />
    </div>

    <div className="bg-gray-800 p-4 w-48">
      <NavigationLink name="Medium Background" href="/" isActive={true} />
    </div>

    <div className="bg-gray-700 p-4 w-48">
      <NavigationLink name="Light Background" href="/" isActive={false} />
    </div>
  </div>
);

// Horizontal layout
export const HorizontalLayout = () => (
  <div className="bg-gray-800 p-4">
    <nav className="flex gap-4">
      <NavigationLink name="Home" href="/" isActive={true} />
      <NavigationLink name="Projects" href="/projects" isActive={false} />
      <NavigationLink name="Contact" href="/contact" isActive={false} />
    </nav>
  </div>
);
