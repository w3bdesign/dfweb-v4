import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import IndexContent from "@/components/Index/IndexContent.component";
import { Pagecontent } from "@/types/sanity.types";

interface SectionProps {
  title: string;
  text: Array<{
    _key: string;
    _type: string;
    children: Array<{
      _key: string;
      _type: string;
      marks: string[];
      text: string;
    }>;
    markDefs: unknown[];
    style: string;
  }>;
}

// Mock the Section component
jest.mock("@/components/Index/Section.component", () => {
  return function MockSection({ title, text }: SectionProps) {
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

const mockContent: Pagecontent[] = [
  {
    _type: "pagecontent",
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
    _type: "pagecontent",
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
  it("renders IndexContent with given content", () => {
    // Arrange
    const expected = {
      sectionCount: 2,
      titles: ["Test Title 1", "Test Title 2"],
      content: ["Bold Text Normal Text", "Italic Text"],
    };

    // Act
    render(<IndexContent pageContent={mockContent} />);
    const sections = screen.getAllByTestId("mock-section");

    // Assert
    expect(sections).toHaveLength(expected.sectionCount);
    expected.titles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
    expected.content.forEach((content) => {
      expect(screen.getByText(content, { exact: false })).toBeInTheDocument();
    });
  });

  it("throws error when no content is provided", () => {
    // Arrange
    const emptyContent: Pagecontent[] = [];
    const expectedError = "Ingen innhold tilgjengelig";

    // Act & Assert
    expect(() => {
      render(<IndexContent pageContent={emptyContent} />);
    }).toThrow(expectedError);
  });
});
