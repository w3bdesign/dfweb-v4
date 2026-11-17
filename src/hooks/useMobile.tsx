import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 639px)";
const MOBILE_BREAKPOINT = 640;

function subscribe(onChange: () => void): () => void {
  // Fallback to resize listener for test environments without matchMedia
  if (!globalThis.matchMedia) {
    globalThis.addEventListener("resize", onChange);
    return () => globalThis.removeEventListener("resize", onChange);
  }

  const mediaQuery = globalThis.matchMedia(MOBILE_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  if (globalThis.matchMedia) {
    return globalThis.matchMedia(MOBILE_QUERY).matches;
  }
  return globalThis.innerWidth < MOBILE_BREAKPOINT;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * A React hook that returns a boolean indicating if the user is on a mobile device.
 * Subscribes to the mobile breakpoint through useSyncExternalStore, so the
 * server render and hydration use `false` and the client value applies after
 * hydration without a mismatch.
 * Includes fallback for test environments where matchMedia is not available.
 *
 * @returns true if the device width is under 640px, else false.
 */
export function useMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
