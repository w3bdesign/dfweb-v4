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

interface MatrixRenderer {
  draw: () => void;
}

export const createMatrixRenderer = ({
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
}: MatrixRendererProps): MatrixRenderer => {
  const drawBackground = () => {
    ctx.fillStyle = `rgba(${rgbBackground.r}, ${rgbBackground.g}, ${rgbBackground.b}, ${fadeFactor})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${tileSize - 2}px monospace`;
  };

  const drawCharacter = (character: string, x: number, y: number) => {
    ctx.fillStyle = `rgb(${rgbFont.r}, ${rgbFont.g}, ${rgbFont.b})`;
    ctx.fillText(character, x, y);
  };

  const drawGlowEffect = (character: string, x: number, y: number) => {
    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 10;
    ctx.fillStyle = glowColor;
    ctx.fillText(character, x, y);
    ctx.restore();
  };

  const updateColumnState = (column: Column) => {
    column.stackCounter++;

    if (column.stackCounter >= column.stackHeight) {
      column.stackHeight = 10 + getRandomInt(maxStackHeight);
      column.stackCounter = 0;
    }
  };

  const drawColumn = (column: Column) => {
    if (column.stackCounter < 0) return;

    const randomCharacter = getRandomCharacter(tileSet);
    const y = column.stackCounter * tileSize + tileSize;

    drawCharacter(randomCharacter, column.x, y);

    // Add glow effect to the last character
    if (column.stackCounter === Math.floor(column.stackHeight) - 1) {
      drawGlowEffect(randomCharacter, column.x, y);
    }
  };

  const drawColumns = () => {
    columns.forEach(column => {
      drawColumn(column);
      updateColumnState(column);
    });
  };

  return {
    draw: () => {
      drawBackground();
      drawColumns();
    }
  };
};
