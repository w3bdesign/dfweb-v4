import React from "react";
import { Meta } from "@ladle/react";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";

export default {
  title: "ErrorBoundary",
  component: ErrorBoundary,
} as Meta;

// Component that throws an error
const BuggyCounter = () => {
  const [counter, setCounter] = React.useState(0);

  if (counter === 5) {
    throw new Error("Counter reached 5!");
  }

  return (
    <div className="p-2 bg-surface rounded">
      <p className="text-white text-sm">Counter: {counter}</p>
      <button
        onClick={() => setCounter(c => c + 1)}
        className="mt-1 px-2 py-1 bg-matrix-light text-black rounded text-xs hover:bg-matrix-dark"
      >
        Increment
      </button>
      <p className="text-gray-400 text-xs mt-1">Crashes at 5</p>
    </div>
  );
};

// Component that throws an error immediately
const ImmediateCrash = () => {
  throw new Error("Immediate crash!");
  return null;
};

// Basic error boundary example
export const Default = () => (
  <div className="bg-gray-800 p-2 h-48">
    <ErrorBoundary compact>
      <BuggyCounter />
    </ErrorBoundary>
  </div>
);

// Immediate crash example
export const ImmediateCrashExample = () => (
  <div className="bg-gray-800 p-2 h-48">
    <ErrorBoundary compact>
      <ImmediateCrash />
    </ErrorBoundary>
  </div>
);

// Multiple error boundaries
export const Multiple = () => (
  <div className="bg-gray-800 p-2 space-y-2">
    <ErrorBoundary compact>
      <div className="p-2 bg-surface rounded">
        <p className="text-white text-xs">Working component</p>
      </div>
    </ErrorBoundary>

    <div className="h-48">
      <ErrorBoundary compact>
        <ImmediateCrash />
      </ErrorBoundary>
    </div>

    <ErrorBoundary compact>
      <div className="p-2 bg-surface rounded">
        <p className="text-white text-xs">Another working component</p>
      </div>
    </ErrorBoundary>
  </div>
);
