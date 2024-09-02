import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import IndexContent from "../../src/components/Index/IndexContent.component";

// Mock the BounceInScroll component
jest.mock(
  "../../src/components/Animations/BounceInScroll.component",
  () =>
    ({ children }) => <div data-testid="bounce-in-scroll">{children}</div>,
);

// Mock the Button component
jest.mock(
  "../../src/components/UI/Button.component",
  () =>
    ({ onClick, children }) => <button onClick={onClick}>{children}</button>,
);

// Mock the PortableText component
jest.mock("@portabletext/react", () => ({
  PortableText: ({ value, components }) => (
    <div data-testid="portable-text">
      {value.map((block) => (
        <div key={block._key}>
          {block.children.map((child) => {
            if (child.marks.includes("link")) {
              const linkValue = block.markDefs.find((def) => def._key === child.marks[0]);
              return components.marks.link({ text: child.text, value: linkValue });
            }
            return <span key={child._key}>{child.text}</span>;
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
          { _key: "a2", _type: "span", marks: [], text: " Normal Text " },
          { _key: "a3", _type: "span", marks: ["link1"], text: "External Link" },
          { _key: "a4", _type: "span", marks: [], text: " " },
          { _key: "a5", _type: "span", marks: ["link2"], text: "Internal Link" },
        ],
        markDefs: [
          { _key: "link1", _type: "link", href: "https://example.com" },
          { _key: "link2", _type: "link", href: "/internal-page" },
        ],
        style: "normal",
      },
    ],
  },
];

describe("IndexContent Component", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = "development";
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  test("renders IndexContent with given content", () => {
    render(<IndexContent pageContent={mockContent} />);

    // Check if the title is rendered
    const title = screen.getByTestId("sanity-title");
    expect(title).toHaveTextContent("Test Title 1");

    // Check if the content is rendered
    const portableText = screen.getByTestId("portable-text");
    expect(portableText).toHaveTextContent("Bold Text Normal Text External Link Internal Link");
  });

  test("renders external links with correct attributes and warning", () => {
    render(<IndexContent pageContent={mockContent} />);
    
    const externalLink = screen.getByText("External Link");
    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(externalLink.parentElement).toContainHTML('<span class="sr-only"> (opens in a new tab)</span>');
    expect(externalLink.parentElement).toContainHTML('<span aria-hidden="true"> ↗</span>');
  });

  test("renders internal links without special attributes or warning", () => {
    render(<IndexContent pageContent={mockContent} />);
    
    const internalLink = screen.getByText("Internal Link");
    expect(internalLink).not.toHaveAttribute("target");
    expect(internalLink).not.toHaveAttribute("rel");
    expect(internalLink.parentElement).not.toContainHTML('<span class="sr-only"> (opens in a new tab)</span>');
    expect(internalLink.parentElement).not.toContainHTML('<span aria-hidden="true"> ↗</span>');
  });

  test("renders error trigger buttons in development environment", () => {
    render(<IndexContent pageContent={mockContent} />);
    const errorButtons = screen.getAllByText("Utløs Testfeil");
    expect(errorButtons).toHaveLength(1);
  });

  test("does not render error trigger buttons in production environment", () => {
    process.env.NODE_ENV = "production";
    render(<IndexContent pageContent={mockContent} />);
    const errorButtons = screen.queryAllByText("Utløs Testfeil");
    expect(errorButtons).toHaveLength(0);
  });

  test("throws error when no content is provided", () => {
    expect(() => {
      render(<IndexContent pageContent={[]} />);
    }).toThrow("Ingen innhold tilgjengelig");
  });

  test("renders BounceInScroll component", () => {
    render(<IndexContent pageContent={mockContent} />);
    const bounceInScrollComponents = screen.getAllByTestId("bounce-in-scroll");
    expect(bounceInScrollComponents).toHaveLength(1);
  });

  test("handles invalid section data", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const invalidContent = [
      {
        id: "3",
        title: "",
        text: [],
      },
    ];

    render(<IndexContent pageContent={invalidContent} />);

    expect(screen.queryByTestId("sanity-section")).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Ugyldig seksjon data"),
    );

    consoleErrorSpy.mockRestore();
  });
});
