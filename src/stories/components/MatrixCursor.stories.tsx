import React, { useRef } from "react";
import { Meta } from "@ladle/react";
import MatrixCursor from "../../components/Animations/MatrixCursor.component";
import "../../app/cursor.css";

export default {
  title: "Animations/MatrixCursor",
  component: MatrixCursor,
} as Meta;

const DemoContainer = ({ children }: { children: React.ReactNode }) => {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={heroRef}
      className="min-h-[400px] bg-gray-900 p-8 rounded-lg relative overflow-hidden"
    >
      {children}
      <MatrixCursor heroRef={heroRef} />
    </div>
  );
};

export const Default = () => (
  <DemoContainer>
    <div className="text-gray-300 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Matrix Cursor Demo</h2>
      <p>
        Move your mouse around this container to see the matrix cursor effect.
      </p>
      <p>The cursor will change and leave a trail of matrix characters.</p>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Hover Area 1</h3>
          <p className="text-sm">
            Move your cursor here to see the effect in action
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Hover Area 2</h3>
          <p className="text-sm">
            Try moving between different areas to see the trail
          </p>
        </div>
      </div>
    </div>
  </DemoContainer>
);

export const WithInteractiveElements = () => (
  <DemoContainer>
    <div className="text-gray-300 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        Interactive Elements Demo
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors">
          Hover Me
        </button>
        <a
          href="#"
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors text-center"
          onClick={(e) => e.preventDefault()}
        >
          Link Example
        </a>
      </div>
      <div className="bg-gray-800 p-6 rounded">
        <p>
          The matrix cursor effect works seamlessly with interactive elements.
          Try hovering over the buttons above.
        </p>
      </div>
    </div>
  </DemoContainer>
);

export const LargeArea = () => (
  <DemoContainer>
    <div className="text-gray-300 min-h-[600px] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Large Area Demo</h2>
        <p>
          This demo shows how the matrix cursor effect works in a larger area.
          <br />
          Move your cursor around to create longer trails.
        </p>
      </div>
    </div>
  </DemoContainer>
);

export const WithContent = () => (
  <DemoContainer>
    <div className="text-gray-300 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        Content Interaction
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-800 p-4 rounded hover:bg-gray-700 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">Card {i}</h3>
            <p className="text-sm">
              Hover over this card to see how the matrix cursor interacts with
              content.
            </p>
          </div>
        ))}
      </div>
      <div className="bg-gray-800 p-6 rounded mt-8">
        <p className="text-lg">
          The matrix cursor effect adds a unique interactive element to your
          content. Try moving between different cards to see how the trail
          follows your movement.
        </p>
      </div>
    </div>
  </DemoContainer>
);
