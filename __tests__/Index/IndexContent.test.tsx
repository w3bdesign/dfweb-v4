import React from "react";
import { render, screen } from "@testing-library/react";

import IndexContent from "../../src/components/Index/IndexContent.component";

// Mock the BounceInScroll component
jest.mock(
  "../../src/components/Animations/BounceInScroll.component",
  () =>
    ({ children }) => <div>{children}</div>
);

// Mock the PortableText component
jest.mock("@portabletext/react", () => ({
  PortableText: ({ value, components }) => (
    <div>
      {value.map((block) => (
        <div key={block._key}>
          {block.children.map((child) => {
            const MarkComponent = components.marks[child.marks[0]];
            return MarkComponent ? (
              <MarkComponent key={child._key}>{child.text}</MarkComponent>
            ) : (
              <span key={child._key}>{child.text}</span>
            );
          })}
        </div>
      ))}
    </div>
  ),
}));

const mockContent = [
  {
    id: "1",
    title: "Test Title 1",
    text: [
      {
        _key: "a",
        _type: "block",
        children: [
          { _key: "a1", _type: "span", marks: ["bold"], text: "Bold Text" },
          { _key: "a2", _type: "span", marks: [], text: " Normal Text" },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
  },
  {
    id: "2",
    title: "Test Title 2",
    text: [
      {
        _key: "b",
        _type: "block",
        children: [
          { _key: "b1", _type: "span", marks: ["italic"], text: "Italic Text" },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
  },
];

// Define the mark components
const Bold = ({ children }) => <strong>{children}</strong>;
const Italic = ({ children }) => <em>{children}</em>;

const components = {
  marks: {
    bold: Bold,
    italic: Italic,
  },
};

describe("IndexContent Component", () => {
  test("renders IndexContent with given content", () => {
    render(<IndexContent pageContent={mockContent} components={components} />);

    // Check if the titles are rendered
    const titles = screen.getAllByTestId("sanity-title");
    expect(titles[0]).toHaveTextContent("Test Title 1");
  });
});
