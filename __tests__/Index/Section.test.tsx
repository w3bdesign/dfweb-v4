import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Section from "../../src/components/Index/Section.component";
import { PortableText } from "@portabletext/react";
import { myPortableTextComponents } from "../../src/utils/portableTextComponents";

// Mock the BounceInScroll component
jest.mock("../../src/components/Animations/BounceInScroll.component", () => {
  return ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
});

// Mock the PortableText component
jest.mock("@portabletext/react", () => ({
  PortableText: jest.fn(() => null),
}));

describe("Section Component", () => {
  const mockProps = {
    title: "Test Title",
    text: [
      {
        _key: "1",
        _type: "block",
        children: [{ _key: "2", _type: "span", text: "Test content", marks: [] }],
        markDefs: [],
        style: "normal"
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with valid props", () => {
    render(<Section {...mockProps} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    const mockCall = (PortableText as jest.Mock).mock.calls[0][0];
    expect(mockCall).toEqual({
      value: mockProps.text,
      components: myPortableTextComponents
    });
  });

  it("returns null with invalid props", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { container } = render(<Section title="" text={[]} />);
    expect(container.firstChild).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("triggers error in development mode", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(<Section {...mockProps} />);
    const errorButton = screen.getByText("Utløs Testfeil");
    expect(errorButton).toBeInTheDocument();

    expect(() => fireEvent.click(errorButton)).toThrow(
      "En uventet feil har oppstått",
    );

    process.env.NODE_ENV = originalNodeEnv;
  });

  it("does not show error button in production mode", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(<Section {...mockProps} />);
    expect(screen.queryByText("Utløs Testfeil")).not.toBeInTheDocument();

    process.env.NODE_ENV = originalNodeEnv;
  });
});
