import { render, screen, fireEvent } from "@testing-library/react";
import Section from "@/components/Index/Section.component";
import { Pagecontent } from "@/types/sanity.types";

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

const mockProps: Pagecontent = {
  _type: "pagecontent",
  title: "Test Title",
  text: [
    {
      _key: "a1",
      _type: "block",
      children: [
        {
          _key: "a1-1",
          _type: "span",
          marks: [],
          text: "Test content",
        },
      ],
      markDefs: [],
      style: "normal",
    },
  ],
};

// Type-safe way to make NODE_ENV writable for tests
type WritableNodeEnv = {
  NODE_ENV?: string;
};

describe("Section Component", () => {
  beforeEach(() => {
    // Note: While NODE_ENV is typically read-only in production environments,
    // Jest allows us to modify it for testing purposes. This is safe in tests
    // but should never be done in production code. We use a type assertion
    // to a writable version for testing only.
    (process.env as WritableNodeEnv).NODE_ENV = "development";
  });

  afterEach(() => {
    // Reset to test environment
    (process.env as WritableNodeEnv).NODE_ENV = "test";
  });

  it("renders with valid props", () => {
    // Arrange
    render(<Section {...mockProps} />);

    // Act
    const title = screen.getByText("Test Title");
    const content = screen.getByText("Test content");

    // Assert
    expect(title).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("triggers error in development mode", () => {
    // Arrange
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(<Section {...mockProps} />);
    const errorButton = screen.getByText("Utløs Testfeil");

    // Act & Assert
    expect(() => fireEvent.click(errorButton)).toThrow(
      "En uventet feil har oppstått",
    );
    consoleErrorSpy.mockRestore();
  });

  it("does not show error button in production mode", () => {
    // Arrange
    (process.env as WritableNodeEnv).NODE_ENV = "production";
    render(<Section {...mockProps} />);

    // Act
    const errorButton = screen.queryByText("Utløs Testfeil");

    // Assert
    expect(errorButton).not.toBeInTheDocument();
  });

  it("does not show error button when showDebugButton is false in development mode", () => {
    // Arrange
    render(<Section {...mockProps} showDebugButton={false} />);

    // Act
    const errorButton = screen.queryByText("Utløs Testfeil");

    // Assert
    expect(errorButton).not.toBeInTheDocument();
  });

  it("shows error button when showDebugButton is true in development mode", () => {
    // Arrange
    render(<Section {...mockProps} showDebugButton={true} />);

    // Act
    const errorButton = screen.getByText("Utløs Testfeil");

    // Assert
    expect(errorButton).toBeInTheDocument();
  });
});
