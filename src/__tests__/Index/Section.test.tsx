import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Section from "@/components/Index/Section.component";
import { PortableText } from "@portabletext/react";
import { myPortableTextComponents } from "@/utils/portableTextComponents";

// Mock the BounceInScroll component
jest.mock("@/components/Animations/BounceInScroll.component", () => {
  const MockBounceInScroll = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );
  MockBounceInScroll.displayName = "MockBounceInScroll";
  return MockBounceInScroll;
});

// Mock the PortableText component
jest.mock("@portabletext/react", () => ({
  PortableText: jest.fn(() => null),
}));

describe("Section Component", () => {
  const mockProps: import("@/types/sanity.types").Pagecontent = {
    _type: "pagecontent",
    title: "Test Title",
    text: [
      {
        _key: "1",
        _type: "block",
        children: [
          { _key: "2", _type: "span", text: "Test content", marks: [] },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
  };

  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("renders with valid props", () => {
    // Arrange - Set up test data and conditions
    const props = mockProps;

    // Act - Perform the action being tested
    render(<Section {...props} />);

    // Assert - Verify the results
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    const mockCall = (PortableText as jest.Mock).mock.calls[0][0];
    expect(mockCall).toStrictEqual({
      value: mockProps.text,
      components: myPortableTextComponents,
    });
  });

  it("returns null with invalid props", () => {
    // Arrange - Set up test data and conditions
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Act - Perform the action being tested
    render(<Section _type="pagecontent" title="" text={[]} />);

    // Assert - Verify the results
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("triggers error in development mode", () => {
    // Arrange - Set up test data and conditions
    process.env = { ...originalEnv, NODE_ENV: "development" };

    // Act - Perform the action being tested
    render(<Section {...mockProps} />);
    const errorButton = screen.getByText("Utløs Testfeil");

    // Assert - Verify the results
    expect(errorButton).toBeInTheDocument();
    expect(() => fireEvent.click(errorButton)).toThrow(
      "En uventet feil har oppstått",
    );
  });

  it("does not show error button in production mode", () => {
    // Arrange - Set up test data and conditions
    process.env = { ...originalEnv, NODE_ENV: "production" };

    // Act - Perform the action being tested
    render(<Section {...mockProps} />);

    // Assert - Verify the results
    expect(screen.queryByText("Utløs Testfeil")).not.toBeInTheDocument();
  });

  it("does not show error button when showDebugButton is false in development mode", () => {
    // Arrange - Set up test data and conditions
    process.env = { ...originalEnv, NODE_ENV: "development" };

    // Act - Perform the action being tested
    render(<Section {...mockProps} showDebugButton={false} />);

    // Assert - Verify the results
    expect(screen.queryByText("Utløs Testfeil")).not.toBeInTheDocument();
  });

  it("shows error button when showDebugButton is true in development mode", () => {
    // Arrange - Set up test data and conditions
    process.env = { ...originalEnv, NODE_ENV: "development" };

    // Act - Perform the action being tested
    render(<Section {...mockProps} showDebugButton={true} />);

    // Assert - Verify the results
    expect(screen.getByText("Utløs Testfeil")).toBeInTheDocument();
  });
});
