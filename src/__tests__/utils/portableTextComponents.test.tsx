import React from "react";
import { render, screen } from "@testing-library/react";
import { PortableText } from "@portabletext/react";

import {
  getTextFromChildren,
  myPortableTextComponents,
} from "@/utils/portableTextComponents";

interface LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  "data-text"?: string;
}

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    className,
    "data-text": dataText,
  }: LinkProps) {
    return (
      <a href={href} className={className} data-text={dataText}>
        {children}
      </a>
    );
  };
});

describe("getTextFromChildren", () => {
  it("returns the string directly when children is a plain string", () => {
    // Arrange
    const input = "Hello world";

    // Act
    const result = getTextFromChildren(input);

    // Assert
    expect(result).toBe("Hello world");
  });

  it("joins array of strings correctly", () => {
    // Arrange
    const input = ["Hello", " ", "world"];

    // Act
    const result = getTextFromChildren(input);

    // Assert
    expect(result).toBe("Hello world");
  });

  it("extracts text from nested React elements", () => {
    // Arrange
    const input = <span>nested text</span>;

    // Act
    const result = getTextFromChildren(input);

    // Assert
    expect(result).toBe("nested text");
  });

  it("returns empty string for null", () => {
    // Arrange
    const input = null;

    // Act
    const result = getTextFromChildren(input);

    // Assert
    expect(result).toBe("");
  });

  it("returns empty string for undefined", () => {
    // Arrange
    const input = undefined;

    // Act
    const result = getTextFromChildren(input);

    // Assert
    expect(result).toBe("");
  });

  it("handles mixed arrays of strings and elements", () => {
    // Arrange
    const input = ["Hello ", <span key="1">world</span>, "!"];

    // Act
    const result = getTextFromChildren(input);

    // Assert
    expect(result).toBe("Hello world!");
  });

  it("converts numbers to strings", () => {
    // Arrange
    const input = 42;

    // Act
    const result = getTextFromChildren(input);

    // Assert
    expect(result).toBe("42");
  });

  it("handles deeply nested elements", () => {
    // Arrange
    const input = (
      <div>
        <span>
          <em>deep</em>
        </span>
      </div>
    );

    // Act
    const result = getTextFromChildren(input);

    // Assert
    expect(result).toBe("deep");
  });
});

describe("myPortableTextComponents marks", () => {
  it("bold mark renders a <b> tag with correct content", () => {
    // Arrange
    const blocks = [
      {
        _key: "b1",
        _type: "block" as const,
        children: [
          {
            _key: "b1-1",
            _type: "span" as const,
            marks: ["bold"],
            text: "Bold text",
          },
        ],
        markDefs: [],
        style: "normal" as const,
      },
    ];

    // Act
    render(
      <PortableText value={blocks} components={myPortableTextComponents} />,
    );
    const boldElement = screen.getByText("Bold text");

    // Assert
    expect(boldElement.tagName).toBe("B");
  });

  it("italic mark renders an <i> tag with correct content", () => {
    // Arrange
    const blocks = [
      {
        _key: "i1",
        _type: "block" as const,
        children: [
          {
            _key: "i1-1",
            _type: "span" as const,
            marks: ["italic"],
            text: "Italic text",
          },
        ],
        markDefs: [],
        style: "normal" as const,
      },
    ];

    // Act
    render(
      <PortableText value={blocks} components={myPortableTextComponents} />,
    );
    const italicElement = screen.getByText("Italic text");

    // Assert
    expect(italicElement.tagName).toBe("I");
  });

  it("code mark renders a <span> with correct className and content", () => {
    // Arrange
    const blocks = [
      {
        _key: "c1",
        _type: "block" as const,
        children: [
          {
            _key: "c1-1",
            _type: "span" as const,
            marks: ["code"],
            text: "Code text",
          },
        ],
        markDefs: [],
        style: "normal" as const,
      },
    ];

    // Act
    render(
      <PortableText value={blocks} components={myPortableTextComponents} />,
    );
    const codeElement = screen.getByText("Code text");

    // Assert
    expect(codeElement.tagName).toBe("SPAN");
    expect(codeElement).toHaveClass("mt-4", "text-lg", "block");
  });

  it("link mark renders a link with correct href from value", () => {
    // Arrange
    const blocks = [
      {
        _key: "l1",
        _type: "block" as const,
        children: [
          {
            _key: "l1-1",
            _type: "span" as const,
            marks: ["link1"],
            text: "Click here",
          },
        ],
        markDefs: [
          {
            _key: "link1",
            _type: "link" as const,
            href: "https://example.com",
          },
        ],
        style: "normal" as const,
      },
    ];

    // Act
    render(
      <PortableText value={blocks} components={myPortableTextComponents} />,
    );
    const linkElement = screen.getByText("Click here");

    // Assert
    expect(linkElement.tagName).toBe("A");
    expect(linkElement).toHaveAttribute("href", "https://example.com");
    expect(linkElement).toHaveClass(
      "glitch",
      "underline",
      "text-lg",
      "font-bold",
      "text-green-400",
    );
  });

  it("link mark renders data-text attribute with plain text for glitch effect", () => {
    // Arrange
    const blocks = [
      {
        _key: "l2",
        _type: "block" as const,
        children: [
          {
            _key: "l2-1",
            _type: "span" as const,
            marks: ["link2"],
            text: "GITHUB",
          },
        ],
        markDefs: [
          {
            _key: "link2",
            _type: "link" as const,
            href: "https://github.com",
          },
        ],
        style: "normal" as const,
      },
    ];

    // Act
    render(
      <PortableText value={blocks} components={myPortableTextComponents} />,
    );
    const linkElement = screen.getByText("GITHUB");

    // Assert
    expect(linkElement).toHaveAttribute("data-text", "GITHUB");
  });

  it("link mark falls back to # when value.href is missing", () => {
    // Arrange
    const blocks = [
      {
        _key: "l3",
        _type: "block" as const,
        children: [
          {
            _key: "l3-1",
            _type: "span" as const,
            marks: ["link3"],
            text: "No href link",
          },
        ],
        markDefs: [
          {
            _key: "link3",
            _type: "link" as const,
          },
        ],
        style: "normal" as const,
      },
    ];

    // Act
    render(
      <PortableText value={blocks} components={myPortableTextComponents} />,
    );
    const linkElement = screen.getByText("No href link");

    // Assert
    expect(linkElement).toHaveAttribute("href", "#");
  });
});
