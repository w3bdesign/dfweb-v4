import React from "react";
import { Meta } from "@ladle/react";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import "@/app/globals.css";

export default {
  title: "ErrorHandling/ErrorBoundary",
  component: ErrorBoundary,
} as Meta;

// Component that throws an error
const BuggyCounter = () => {
  const [counter, setCounter] = React.useState(0);

  if (counter === 5) {
    throw new Error("Counter reached 5!");
  }

  return (
    <div className="p-2 bg-surface rounded-sm">
      <p className="text-sm">Counter: {counter}</p>
      <button
        onClick={() => setCounter((c) => c + 1)}
        className="mt-1 px-2 py-1 bg-matrix-light text-black rounded-sm text-xs hover:bg-matrix-dark"
      >
        Increment
      </button>
      <p className="text-xs mt-1 text-gray-400">Crashes at 5</p>
    </div>
  );
};

// Component that throws an error immediately
const ImmediateCrash = () => {
  throw new Error("Immediate crash!");
};

// Basic error boundary example
export const Default = () => (
  <ErrorBoundary>
    <BuggyCounter />
  </ErrorBoundary>
);

// Compact error boundary example
export const CompactError = () => (
  <ErrorBoundary compact>
    <ImmediateCrash />
  </ErrorBoundary>
);

// Multiple error boundaries
export const Multiple = () => (
  <div className="space-y-2">
    <ErrorBoundary compact>
      <div className="p-2 bg-surface rounded-sm">
        <p className="text-xs">Working component</p>
      </div>
    </ErrorBoundary>

    <ErrorBoundary compact>
      <ImmediateCrash />
    </ErrorBoundary>

    <ErrorBoundary compact>
      <div className="p-2 bg-surface rounded-sm">
        <p className="text-xs">Another working component</p>
      </div>
    </ErrorBoundary>
  </div>
);
