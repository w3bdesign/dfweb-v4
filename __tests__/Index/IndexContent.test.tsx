import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import IndexContent from "../../src/components/Index/IndexContent.component";

// Mock the BounceInScroll component
jest.mock(
  "../../src/components/Animations/BounceInScroll.component",
  () =>
    ({ children }) => <div data-testid="bounce-in-scroll">{children}</div>,
);

// Mock the PortableText component
jest.mock("@portabletext/react", () => ({
  PortableText: ({ value, components }) => (
    <div>
      {value.map((block, index) => (
        <div key={block._key || index}>
          {block.children.map((child, childIndex) => {
            const MarkComponent = components?.marks?.[child.marks[0]];
            return MarkComponent ? (
              <MarkComponent key={child._key || childIndex}>{child.text}</MarkComponent>
            ) : (
              <span key={child._key || childIndex}>{child.text}</span>
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
    render(<IndexContent pageContent={mockContent} />);

    // Check if the titles are rendered
    const titles = screen.getAllByTestId("sanity-title");
    expect(titles[0]).toHaveTextContent("Test Title 1");
    expect(titles[1]).toHaveTextContent("Test Title 2");

    // Check if the content is rendered
    expect(screen.getByText("Bold Text Normal Text")).toBeInTheDocument();
    expect(screen.getByText("Italic Text")).toBeInTheDocument();
  });

  test("renders error trigger buttons", () => {
    render(<IndexContent pageContent={mockContent} />);
    const errorButtons = screen.getAllByText("Utløs Testfeil");
    expect(errorButtons).toHaveLength(2);
  });

  test("throws error when error button is clicked", () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<IndexContent pageContent={mockContent} />);
    const errorButton = screen.getAllByText("Utløs Testfeil")[0];

    expect(() => {
      fireEvent.click(errorButton);
    }).toThrow("En uventet feil har oppstått");

    consoleErrorSpy.mockRestore();
  });

  test("throws error when no content is provided", () => {
    expect(() => {
      render(<IndexContent pageContent={[]} />);
    }).toThrow("Ingen innhold tilgjengelig");
  });

  test("renders BounceInScroll component", () => {
    render(<IndexContent pageContent={mockContent} />);
    const bounceInScrollComponents = screen.getAllByTestId("bounce-in-scroll");
    expect(bounceInScrollComponents).toHaveLength(2);
  });

  test("handles invalid section data", () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const invalidContent = [
      {
        id: "3",
        title: "",
        text: [],
      },
    ];

    render(<IndexContent pageContent={invalidContent} />);
    
    expect(screen.queryByTestId("sanity-section")).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Ugyldig seksjon data"));

    consoleErrorSpy.mockRestore();
  });
});
