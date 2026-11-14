import { render, screen } from "@testing-library/react";
import ReactMatrixAnimation from "@/components/Animations/Matrix.component";

const mockFillRect = vi.fn();
const mockFillText = vi.fn();

const mock2DContext = {
  fillRect: mockFillRect,
  fillText: mockFillText,
  canvas: document.createElement("canvas"),
  getContextAttributes: () => ({}),
  globalAlpha: 1,
  globalCompositeOperation: "source-over",
  save: vi.fn(),
  restore: vi.fn(),
  font: "",
  fillStyle: "",
  shadowColor: "",
  shadowBlur: 0,
} as unknown as CanvasRenderingContext2D;

const mockBitmapContext = {
  canvas: document.createElement("canvas"),
  transferFromImageBitmap: vi.fn(),
} as unknown as ImageBitmapRenderingContext;

HTMLCanvasElement.prototype.getContext = function (contextId: string) {
  switch (contextId) {
    case "2d":
      return mock2DContext;
    case "bitmaprenderer":
      return mockBitmapContext;
    case "webgl":
    case "webgl2":
      return null;
    default:
      return null;
  }
} as typeof HTMLCanvasElement.prototype.getContext;

vi.spyOn(global, "requestAnimationFrame").mockImplementation((cb) =>
  setTimeout(cb, 0),
);

describe("ReactMatrixAnimation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) =>
      setTimeout(cb, 0),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders canvas element with default props", () => {
      // Arrange
      const expectedTestId = "matrix-canvas";

      // Act
      render(<ReactMatrixAnimation />);
      const canvas = screen.getByTestId(expectedTestId);

      // Assert
      expect(canvas).toBeInTheDocument();
      expect(canvas).toHaveStyle({
        width: "100%",
        height: "100%",
      });
    });

    it("renders canvas element with custom props", () => {
      // Arrange
      const customProps = {
        tileSize: 30,
        fadeFactor: 0.7,
        backgroundColor: "#000000",
        fontColor: "#ffffff",
        tileSet: ["A", "B", "C"],
      };
      const expectedTestId = "matrix-canvas";

      // Act
      render(<ReactMatrixAnimation {...customProps} />);
      const canvas = screen.getByTestId(expectedTestId);

      // Assert
      expect(canvas).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    beforeEach(() => {
      // Arrange - Suppress console.error for validation tests
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("throws error for invalid background color", () => {
      // Arrange
      const invalidProps = { backgroundColor: "invalid" };
      const expectedError =
        "Invalid background color. Use a hex value e.g. #030303";

      // Act & Assert
      expect(() => {
        render(<ReactMatrixAnimation {...invalidProps} />);
      }).toThrow(expectedError);
    });

    it("throws error for invalid font color", () => {
      // Arrange
      const invalidProps = { fontColor: "invalid" };
      const expectedError = "Invalid font color. Use a hex value e.g. #030303";

      // Act & Assert
      expect(() => {
        render(<ReactMatrixAnimation {...invalidProps} />);
      }).toThrow(expectedError);
    });
  });
});
