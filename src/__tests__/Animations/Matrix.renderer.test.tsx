import { createMatrixRenderer } from "@/components/Animations/Matrix.renderer";
import { RGB, Column } from "@/components/Animations/Matrix.utils";

import "@testing-library/jest-dom";

describe("Matrix Renderer", () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockCanvas: HTMLCanvasElement;
  let columns: Column[];

  const rgbBackground: RGB = { r: 0, g: 0, b: 0 };
  const rgbFont: RGB = { r: 0, g: 255, b: 0 };
  const defaultConfig = {
    maxStackHeight: 20,
    tileSize: 10,
    fadeFactor: 0.5,
    rgbBackground,
    rgbFont,
    glowColor: "#00ff00",
    tileSet: ["A", "B", "C"],
    getRandomInt: (max: number) => 123456789 % max,
  };

  beforeEach(() => {
    mockCtx = {
      fillStyle: "",
      fillRect: jest.fn(),
      fillText: jest.fn(),
      font: "",
      save: jest.fn(),
      restore: jest.fn(),
      shadowColor: "",
      shadowBlur: 0,
    } as unknown as CanvasRenderingContext2D;

    mockCanvas = {
      width: 100,
      height: 100,
    } as unknown as HTMLCanvasElement;

    columns = [
      {
        x: 0,
        stackHeight: 10,
        stackCounter: 5,
      },
    ];
  });

  it("creates a renderer with the provided configuration", () => {
    // Act
    const view = createMatrixRenderer({
      ctx: mockCtx,
      canvas: mockCanvas,
      columns,
      ...defaultConfig,
    });

    // Assert
    expect(typeof view.draw).toBe("function");
  });

  it("draws background with correct settings", () => {
    // Arrange
    const view = createMatrixRenderer({
      ctx: mockCtx,
      canvas: mockCanvas,
      columns,
      ...defaultConfig,
    });
    const expectedFont = "8px monospace";

    // Act
    view.draw();

    // Assert
    // The fillStyle should be set to the font color after drawing is complete
    // since that's the last operation
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 100, 100);
    expect(mockCtx.font).toBe(expectedFont);
    expect(mockCtx.fillStyle).toBe(
      `rgb(${rgbFont.r}, ${rgbFont.g}, ${rgbFont.b})`,
    );
  });

  it("draws columns with characters", () => {
    // Arrange
    const view = createMatrixRenderer({
      ctx: mockCtx,
      canvas: mockCanvas,
      columns,
      ...defaultConfig,
    });

    // Act
    view.draw();

    // Assert
    expect(mockCtx.fillText).toHaveBeenCalled();
  });

  it("applies glow effect when drawing the last character in stack", () => {
    // Arrange
    columns[0].stackCounter = columns[0].stackHeight - 1;
    const view = createMatrixRenderer({
      ctx: mockCtx,
      canvas: mockCanvas,
      columns,
      ...defaultConfig,
    });

    // Act
    view.draw();

    // Assert
    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it("updates column state correctly", () => {
    // Arrange
    const view = createMatrixRenderer({
      ctx: mockCtx,
      canvas: mockCanvas,
      columns,
      ...defaultConfig,
    });
    const originalStackCounter = columns[0].stackCounter;

    // Act
    view.draw();

    // Assert
    expect(columns[0].stackCounter).toBe(originalStackCounter + 1);
  });

  it("resets column when reaching stack height", () => {
    // Arrange
    columns[0].stackCounter = columns[0].stackHeight - 1;
    const view = createMatrixRenderer({
      ctx: mockCtx,
      canvas: mockCanvas,
      columns,
      ...defaultConfig,
    });
    const expectedNewStackHeight = 19; // 10 + (123456789 % 20)

    // Act
    view.draw();

    // Assert
    expect(columns[0].stackCounter).toBe(0);
    expect(columns[0].stackHeight).toBe(expectedNewStackHeight);
  });

  it("applies glow effect to the last character", () => {
    // Arrange
    columns[0].stackCounter = columns[0].stackHeight - 1;
    const view = createMatrixRenderer({
      ctx: mockCtx,
      canvas: mockCanvas,
      columns,
      ...defaultConfig,
    });

    // Act
    view.draw();

    // Assert
    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.shadowColor).toBe("#00ff00");
    expect(mockCtx.shadowBlur).toBe(10);
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it("skips drawing for columns with negative stack counter", () => {
    // Arrange
    columns[0].stackCounter = -1;
    const view = createMatrixRenderer({
      ctx: mockCtx,
      canvas: mockCanvas,
      columns,
      ...defaultConfig,
    });

    // Act
    view.draw();

    // Assert
    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });
});
