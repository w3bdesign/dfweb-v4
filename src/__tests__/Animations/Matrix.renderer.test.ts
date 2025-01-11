import { MatrixRenderer } from "@/components/Animations/Matrix.renderer";
import { RGB, Column } from "@/components/Animations/Matrix.utils";

describe("MatrixRenderer", () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockCanvas: HTMLCanvasElement;
  let columns: Column[];
  let renderer: MatrixRenderer;

  const rgbBackground: RGB = { r: 0, g: 0, b: 0 };
  const rgbFont: RGB = { r: 0, g: 255, b: 0 };

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

    renderer = new MatrixRenderer({
      ctx: mockCtx,
      canvas: mockCanvas,
      columns,
      maxStackHeight: 20,
      tileSize: 10,
      fadeFactor: 0.5,
      rgbBackground,
      rgbFont,
      glowColor: "#00ff00",
      tileSet: ["A", "B", "C"],
      getRandomInt: (max: number) => 123456789 % max,
    });
  });

  it("draws background", () => {
    // Arrange
    const expectedFont = "8px monospace";

    // Act
    renderer.draw();

    // Assert
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 100, 100);
    expect(mockCtx.font).toBe(expectedFont);
  });

  it("draws columns with characters", () => {
    // Arrange
    const mockStackCounter = columns[0].stackCounter;
    const mockStackHeight = columns[0].stackHeight;

    // Act
    renderer.draw();

    // Assert
    expect(mockCtx.fillText).toHaveBeenCalled();
    if (mockStackCounter === Math.floor(mockStackHeight) - 1) {
      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.restore).toHaveBeenCalled();
    }
  });

  it("updates column counters", () => {
    // Arrange
    const originalStackCounter = columns[0].stackCounter;
    
    // Act
    renderer.draw();
    
    // Assert
    expect(columns[0].stackCounter).toBe(originalStackCounter + 1);
  });

  it("resets column when reaching stack height", () => {
    // Arrange
    columns[0].stackCounter = columns[0].stackHeight - 1;
    const expectedNewStackHeight = 19; // 10 + (123456789 % 20)
    
    // Act
    renderer.draw();
    
    // Assert
    expect(columns[0].stackCounter).toBe(0);
    expect(columns[0].stackHeight).toBe(expectedNewStackHeight);
  });
});
