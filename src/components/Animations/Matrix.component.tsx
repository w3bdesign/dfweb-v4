"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { createMatrixRenderer } from "./Matrix.renderer";
import { hexToRgb, getRandomInt, debounce, Column } from "./Matrix.utils";

export interface ReactMatrixAnimationProps {
  tileSize?: number;
  fadeFactor?: number;
  backgroundColor?: string;
  fontColor?: string;
  glowColor?: string;
  tileSet?: string[] | null;
}

const CANVAS_ID = "matrixCanvas";

/**
 * ReactMatrixAnimation component
 * @param {ReactMatrixAnimationProps} props - The props for the ReactMatrixAnimation component
 * @returns {JSX.Element} The rendered ReactMatrixAnimation component
 */
const ReactMatrixAnimation: React.FC<ReactMatrixAnimationProps> = ({
  tileSize = 20,
  fadeFactor = 0.5,
  backgroundColor = "#111111",
  fontColor = "#008529",
  glowColor = "#00FF00",
  tileSet = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const maxStackHeightRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);
  const fps = 10;
  const frameInterval = 1000 / fps;

  const rgbBackground = hexToRgb(backgroundColor);
  if (!rgbBackground) {
    throw new Error("Invalid background color. Use a hex value e.g. #030303");
  }

  const rgbFont = hexToRgb(fontColor);
  if (!rgbFont) {
    throw new Error("Invalid font color. Use a hex value e.g. #030303");
  }

  /**
   * Initializes the matrix columns
   * @param {HTMLCanvasElement} canvas - The canvas element
   */
  const initMatrix = useCallback(
    (canvas: HTMLCanvasElement) => {
      const columns: Column[] = [];
      const maxStackHeight = Math.ceil(canvas.height / tileSize);

      for (let i = 0; i < canvas.width / tileSize; ++i) {
        const column: Column = {
          x: i * tileSize,
          stackHeight: 10 + getRandomInt(maxStackHeight),
          stackCounter: -getRandomInt(maxStackHeight * 2),
        };

        columns.push(column);
      }

      columnsRef.current = columns;
      maxStackHeightRef.current = maxStackHeight;
    },
    [tileSize],
  );

  const tick = useCallback(
    (
      timestamp: number,
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
    ) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const delta = timestamp - lastFrameTimeRef.current;

      if (delta > frameInterval) {
        const renderer = createMatrixRenderer({
          ctx,
          canvas,
          columns: columnsRef.current,
          maxStackHeight: maxStackHeightRef.current,
          tileSize,
          fadeFactor,
          rgbBackground,
          rgbFont,
          glowColor,
          tileSet,
          getRandomInt,
        });
        renderer.draw();
        lastFrameTimeRef.current = timestamp - (delta % frameInterval);
      }

      requestAnimationFrame((timestamp) => tick(timestamp, ctx, canvas));
    },
    [fadeFactor, rgbBackground, rgbFont, tileSize, glowColor, tileSet],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const boundingClientRect = canvas.getBoundingClientRect();
      canvas.width = boundingClientRect.width;
      canvas.height = boundingClientRect.height;

      initMatrix(canvas);
      isInitializedRef.current = true;
    };

    const debouncedResize = debounce(handleResize, 100);

    window.addEventListener("resize", debouncedResize);
    handleResize();

    requestAnimationFrame((timestamp) => tick(timestamp, ctx, canvas));

    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, [initMatrix, tick]);

  return (
    <canvas
      ref={canvasRef}
      id={CANVAS_ID}
      style={{ width: "100%", height: "100%" }}
      data-testid="matrix-canvas"
      className="absolute inset-0"
    />
  );
};

export default ReactMatrixAnimation;
