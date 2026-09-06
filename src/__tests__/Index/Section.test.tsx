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

// Type for testing invalid props
type InvalidSectionProps = Omit<Pagecontent, "title" | "text"> & {
  title?: string | null;
  text?: Pagecontent["text"] | null;
};

const SERIALIZED_TEXT = JSON.stringify(mockProps.text);

const setNodeEnv = (value: string) => {
  (process.env as WritableNodeEnv).NODE_ENV = value;
};

const invalidDataMessage = (title: unknown, text: unknown) =>
  `Ugyldig seksjon data: tittel=${title}, tekst=${text}`;

describe("Section Component", () => {
  beforeEach(() => setNodeEnv("development"));
  afterEach(() => setNodeEnv("test"));

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

  describe("error handling for invalid data", () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
    });

    afterEach(() => consoleErrorSpy.mockRestore());

    it.each<{
      name: string;
      overrides: Partial<InvalidSectionProps>;
      expectedMessage: string;
    }>([
      {
        name: "title is missing",
        overrides: { title: undefined },
        expectedMessage: invalidDataMessage("undefined", SERIALIZED_TEXT),
      },
      {
        name: "title is null",
        overrides: { title: null },
        expectedMessage: invalidDataMessage("null", SERIALIZED_TEXT),
      },
      {
        name: "title is empty string",
        overrides: { title: "" },
        expectedMessage: invalidDataMessage("", SERIALIZED_TEXT),
      },
      {
        name: "text is missing",
        overrides: { text: undefined },
        expectedMessage: invalidDataMessage("Test Title", "undefined"),
      },
      {
        name: "text is null",
        overrides: { text: null },
        expectedMessage: invalidDataMessage("Test Title", "null"),
      },
      {
        name: "both title and text are missing",
        overrides: { title: undefined, text: undefined },
        expectedMessage: invalidDataMessage("undefined", "undefined"),
      },
    ])(
      "returns null and logs error when $name",
      ({ overrides, expectedMessage }) => {
        // Arrange
        const props = { ...mockProps, ...overrides } as Pagecontent;

        // Act
        const { container } = render(<Section {...props} />);

        // Assert
        expect(container.firstChild).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith(expectedMessage);
      },
    );

    it("renders normally when text is empty array", () => {
      // Arrange
      const propsWithEmptyText: Pagecontent = { ...mockProps, text: [] };

      // Act
      const { container } = render(<Section {...propsWithEmptyText} />);

      // Assert
      // Empty array is truthy in JavaScript, so the component renders
      expect(container.firstChild).not.toBeNull();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });
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
    setNodeEnv("production");
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
