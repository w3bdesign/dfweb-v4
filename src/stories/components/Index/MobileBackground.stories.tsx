import React from "react";
import { Meta } from "@ladle/react";
import MobileBackground from "@/components/Index/MobileBackground.component";
import "@/app/globals.css";

export default {
  title: "Index/MobileBackground",
  component: MobileBackground,
  parameters: {
    docs: {
      description: {
        component:
          "Mobile background component that is only visible on mobile screens (md:hidden). In desktop view, this component will not be displayed.",
      },
    },
  },
} as Meta;

// Default mobile background (note: only visible on mobile screens)
export const Default = () => (
  <div className="relative h-[32rem] overflow-hidden w-full bg-gray-800 p-4">
    <p className="text-white text-center mb-4">
      Note: This component has md:hidden class so it&apos;s not visible on
      desktop/Ladle. Use the &quot;Visible&quot; story below to see how it
      looks.
    </p>
    <MobileBackground />
    <div className="relative z-10 flex items-center justify-center h-full">
      <p className="text-white p-2 border border-white">Component location</p>
    </div>
  </div>
);

// Modified version with the md:hidden class removed to make it visible in Ladle
export const Visible = () => (
  <div className="relative h-[32rem] overflow-hidden w-full">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat pb-4"
      style={{
        backgroundImage: "url('/images/mobilbg.webp')",
        top: "-0.5rem",
        marginBottom: "0.5rem",
      }}
    />
    <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
      <div className="bg-black/50 p-4 rounded-lg max-w-md">
        <h1 className="text-white text-2xl font-bold text-center mb-2">
          Mobile Background
        </h1>
        <p className="text-white text-md text-center">
          This is how the component looks on mobile screens, with the md:hidden
          class removed so it&apos;s visible in Ladle.
        </p>
      </div>
    </div>
  </div>
);

// With content overlay
export const WithContent = () => (
  <div className="relative h-[32rem] overflow-hidden w-full">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat pb-4"
      style={{
        backgroundImage: "url('/images/mobilbg.webp')",
        top: "-0.5rem",
        marginBottom: "0.5rem",
      }}
    />
    <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
      <div className="bg-black/50 p-6 rounded-lg max-w-md text-center">
        <h1 className="text-white text-4xl font-bold mb-4">Welcome</h1>
        <p className="text-white text-xl">
          This content is displayed over the mobile background. The background
          is only visible on mobile devices.
        </p>
        <button className="mt-6 bg-white text-black px-4 py-2 rounded">
          Get Started
        </button>
      </div>
    </div>
  </div>
);

// Dark vs light content comparison
export const ContentComparison = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="p-2 border border-gray-500 rounded">
      <h2 className="text-center mb-2">Dark Overlay</h2>
      <div className="relative h-[16rem] overflow-hidden w-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/mobilbg.webp')",
            top: "-0.5rem",
            marginBottom: "0.5rem",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <div className="bg-black/70 p-4 rounded-lg">
            <p className="text-white text-center">
              Dark overlay for better contrast
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="p-2 border border-gray-500 rounded">
      <h2 className="text-center mb-2">Light Text</h2>
      <div className="relative h-[16rem] overflow-hidden w-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/mobilbg.webp')",
            top: "-0.5rem",
            marginBottom: "0.5rem",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <p className="text-white text-center font-bold text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Text with drop shadow
          </p>
        </div>
      </div>
    </div>
  </div>
);
