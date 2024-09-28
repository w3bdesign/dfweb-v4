import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import IndexContent from "../../src/components/Index/IndexContent.component";

// Mock the Section component
jest.mock("../../src/components/Index/Section.component", () => {
  return function MockSection({ title, text }) {
    return (
      <div data-testid="mock-section">
        <h2 data-testid="sanity-title">{title}</h2>
        <div data-testid="portable-text">
          {text.map((block) => (
            <div key={block._key}>
              {block.children.map((child) => (
                <span key={child._key}>{child.text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
});

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

describe("IndexContent Component", () => {
  test("renders IndexContent with given content", () => {
    render(<IndexContent pageContent={mockContent} />);

    // Check if the sections are rendered
    const sections = screen.getAllByTestId("mock-section");
    expect(sections).toHaveLength(2);

    // Check if the titles are rendered
    const titles = screen.getAllByTestId("sanity-title");
    expect(titles[0]).toHaveTextContent("Test Title 1");
    expect(titles[1]).toHaveTextContent("Test Title 2");

    // Check if the content is rendered
    const portableTexts = screen.getAllByTestId("portable-text");
    expect(portableTexts[0]).toHaveTextContent("Bold Text Normal Text");
    expect(portableTexts[1]).toHaveTextContent("Italic Text");
  });

  test("throws error when no content is provided", () => {
    expect(() => {
      render(<IndexContent pageContent={[]} />);
    }).toThrow("Ingen innhold tilgjengelig");
  });
});
