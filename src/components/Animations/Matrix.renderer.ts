import { RGB, Column, getRandomCharacter } from "./Matrix.utils";

interface MatrixRendererProps {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  columns: Column[];
  maxStackHeight: number;
  tileSize: number;
  fadeFactor: number;
  rgbBackground: RGB;
  rgbFont: RGB;
  glowColor: string;
  tileSet: string[] | null;
  getRandomInt: (max: number) => number;
}

export class MatrixRenderer {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly canvas: HTMLCanvasElement;
  private readonly columns: Column[];
  private readonly maxStackHeight: number;
  private readonly tileSize: number;
  private readonly fadeFactor: number;
  private readonly rgbBackground: RGB;
  private readonly rgbFont: RGB;
  private readonly glowColor: string;
  private readonly tileSet: string[] | null;
  private readonly getRandomInt: (max: number) => number;

  constructor({
    ctx,
    canvas,
    columns,
    maxStackHeight,
    tileSize,
    fadeFactor,
    rgbBackground,
    rgbFont,
    glowColor,
    tileSet,
    getRandomInt,
  }: MatrixRendererProps) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.columns = columns;
    this.maxStackHeight = maxStackHeight;
    this.tileSize = tileSize;
    this.fadeFactor = fadeFactor;
    this.rgbBackground = rgbBackground;
    this.rgbFont = rgbFont;
    this.glowColor = glowColor;
    this.tileSet = tileSet;
    this.getRandomInt = getRandomInt;
  }

  draw(): void {
    this.drawBackground();
    this.drawColumns();
  }

  private drawBackground(): void {
    this.ctx.fillStyle = `rgba(${this.rgbBackground.r}, ${this.rgbBackground.g}, ${this.rgbBackground.b}, ${this.fadeFactor})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = `${this.tileSize - 2}px monospace`;
  }

  private drawColumns(): void {
    for (const column of this.columns) {
      if (column.stackCounter >= 0) {
        const randomCharacter = getRandomCharacter(this.tileSet);
        const y = column.stackCounter * this.tileSize + this.tileSize;

        // Draw regular characters
        this.ctx.fillStyle = `rgb(${this.rgbFont.r}, ${this.rgbFont.g}, ${this.rgbFont.b})`;
        this.ctx.fillText(randomCharacter, column.x, y);

        // Add glow effect to the last character
        if (column.stackCounter === Math.floor(column.stackHeight) - 1) {
          this.ctx.save();
          this.ctx.shadowColor = this.glowColor;
          this.ctx.shadowBlur = 10;
          this.ctx.fillStyle = this.glowColor;
          this.ctx.fillText(randomCharacter, column.x, y);
          this.ctx.restore();
        }
      }

      column.stackCounter++;

      if (column.stackCounter >= column.stackHeight) {
        column.stackHeight = 10 + this.getRandomInt(this.maxStackHeight);
        column.stackCounter = 0;
      }
    }
  }
}
