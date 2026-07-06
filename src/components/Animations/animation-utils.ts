import type { RefObject } from "react";

/**
 * Creates animation lifecycle handlers that manage `will-change` for performance.
 * Sets `will-change: opacity` on start, resets to `auto` on complete.
 */
export function createWillChangeHandlers(ref: RefObject<HTMLDivElement | null>) {
  return {
    onAnimationStart: () => {
      if (ref.current) ref.current.style.willChange = "opacity";
    },
    onAnimationComplete: () => {
      if (ref.current) ref.current.style.willChange = "auto";
    },
  };
}
