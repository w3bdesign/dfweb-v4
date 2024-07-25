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
  fadeFactor = 0.5,
  backgroundColor = "#111111",
  fontColor = "#008529",
  glowColor = "#00FF00",
  tileSet = null,
}) => {
  const canvasRef = useRef(null);
  const columnsRef = useRef([]);
  const maxStackHeightRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const isInitializedRef = useRef(false);
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

  const getRandomInt = useCallback((max) => {
    return Math.floor(Math.random() * max);
  }, []);

  const initMatrix = useCallback(
    (canvas) => {
      const columns = [];
      const maxStackHeight = Math.ceil(canvas.height / tileSize);

      for (let i = 0; i < canvas.width / tileSize; ++i) {
        const column = {
          x: i * tileSize,
          stackHeight: 10 + getRandomInt(maxStackHeight),
          stackCounter: -getRandomInt(maxStackHeight * 2), // Start with negative counter, doubled range for more variety
        };

        columns.push(column);
      }

      columnsRef.current = columns;
      maxStackHeightRef.current = maxStackHeight;
    },
    [tileSize, getRandomInt]
  );

  const getRandomCharacter = useCallback(() => {
    if (tileSet && Array.isArray(tileSet) && tileSet.length > 0) {
      return tileSet[getRandomInt(tileSet.length)];
    }
    return String.fromCharCode(33 + getRandomInt(94));
  }, [tileSet, getRandomInt]);

  const draw = useCallback(
    (ctx, canvas) => {
      ctx.fillStyle = `rgba(${rgbBackground.r}, ${rgbBackground.g}, ${rgbBackground.b}, ${fadeFactor})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${tileSize - 2}px monospace`;

      const columns = columnsRef.current;

      for (let i = 0; i < columns.length; ++i) {
        if (columns[i].stackCounter >= 0) {
          const randomCharacter = getRandomCharacter();
          const y = columns[i].stackCounter * tileSize + tileSize;

          // Draw regular characters
          ctx.fillStyle = `rgb(${rgbFont.r}, ${rgbFont.g}, ${rgbFont.b})`;
          ctx.fillText(randomCharacter, columns[i].x, y);

          // Add glow effect to the last character
          if (
            columns[i].stackCounter ===
            Math.floor(columns[i].stackHeight) - 1
          ) {
            ctx.save();
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 10;
            ctx.fillStyle = glowColor;
            ctx.fillText(randomCharacter, columns[i].x, y);
            ctx.restore();
          }
        }

        columns[i].stackCounter++;

        if (columns[i].stackCounter >= columns[i].stackHeight) {
          columns[i].stackHeight = 10 + getRandomInt(maxStackHeightRef.current);
          columns[i].stackCounter = 0;
        }
      }
    },
    [
      fadeFactor,
      rgbBackground,
      rgbFont,
      tileSize,
      getRandomCharacter,
      glowColor,
      getRandomInt,
    ]
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

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

export default ReactMatrixAnimation;
