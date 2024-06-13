"use client";

import React, { useEffect, useRef, useCallback } from "react";

const CANVAS_ID = "matrixCanvas";

const hexToRgb = (hexValue) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const ReactMatrixAnimation = ({
  tileSize = 20,
  fadeFactor = 0.05,
  backgroundColor = "#030303",
  fontColor = "#008529",
  tileSet = null,
}) => {
  const canvasRef = useRef(null);
  const columnsRef = useRef([]);
  const maxStackHeightRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const fps = 10; // Desired frames per second
  const frameInterval = 1000 / fps;

  const rgbBackground = hexToRgb(backgroundColor);
  if (!rgbBackground) {
    throw new Error("Invalid background color. Use a hex value e.g. #030303");
  }

  const rgbFont = hexToRgb(fontColor);
  if (!rgbFont) {
    throw new Error("Invalid font color. Use a hex value e.g. #030303");
  }

  const initMatrix = useCallback(
    (canvas) => {
      const columns = [];
      const maxStackHeight = Math.ceil(canvas.height / tileSize);

      for (let i = 0; i < canvas.width / tileSize; ++i) {
        const column = {
          x: i * tileSize,
          stackHeight: 10 + Math.random() * maxStackHeight,
          stackCounter: 0,
        };

        columns.push(column);
      }

      columnsRef.current = columns;
      maxStackHeightRef.current = maxStackHeight;
    },
    [tileSize]
  );

  const getRandomCharacter = useCallback(() => {
    if (tileSet && Array.isArray(tileSet) && tileSet.length > 0) {
      const random = Math.floor(Math.random() * tileSet.length);
      return tileSet[random];
    }
    return String.fromCharCode(33 + Math.floor(Math.random() * 94));
  }, [tileSet]);

  const draw = useCallback(
    (ctx, canvas) => {
      ctx.fillStyle = `rgba(${rgbBackground.r}, ${rgbBackground.g}, ${rgbBackground.b}, ${fadeFactor})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${tileSize - 2}px monospace`;
      ctx.fillStyle = `rgb(${rgbFont.r}, ${rgbFont.g}, ${rgbFont.b})`;

      const columns = columnsRef.current;

      for (let i = 0; i < columns.length; ++i) {
        const randomCharacter = getRandomCharacter();
        ctx.fillText(
          randomCharacter,
          columns[i].x,
          columns[i].stackCounter * tileSize + tileSize
        );

        if (++columns[i].stackCounter >= columns[i].stackHeight) {
          columns[i].stackHeight =
            10 + Math.random() * maxStackHeightRef.current;
          columns[i].stackCounter = 0;
        }
      }
    },
    [fadeFactor, rgbBackground, rgbFont, tileSize, getRandomCharacter]
  );

  const tick = useCallback(
    (timestamp, ctx, canvas) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const delta = timestamp - lastFrameTimeRef.current;

      if (delta > frameInterval) {
        draw(ctx, canvas);
        lastFrameTimeRef.current = timestamp - (delta % frameInterval);
      }

      requestAnimationFrame((timestamp) => tick(timestamp, ctx, canvas));
    },
    [draw, frameInterval]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleResize = () => {
      const boundingClientRect = canvas.getBoundingClientRect();
      canvas.width = boundingClientRect.width;
      canvas.height = boundingClientRect.height;

      initMatrix(canvas);
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
    />
  );
};

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

export default ReactMatrixAnimation;
