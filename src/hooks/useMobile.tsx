import { useState, useEffect } from "react";

/**
 * A React hook that returns a boolean indicating if the user is on a mobile device.
 * Uses matchMedia to subscribe to breakpoint changes instead of resize events,
 * aligning with React best practices for derived state subscriptions.
 * Includes fallback for test environments where matchMedia is not available.
 *
 * @returns true if the device width is under 640px, else false.
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof globalThis.window === "undefined") return false;
    if (globalThis.matchMedia) {
      return globalThis.matchMedia("(max-width: 639px)").matches;
    }
    return globalThis.innerWidth < 640;
  });

  useEffect(() => {
    if (typeof globalThis.window === "undefined") return;

    // Fallback to resize listener for test environments without matchMedia
    if (!globalThis.matchMedia) {
      const handleResize = (): void => {
        setIsMobile(globalThis.innerWidth < 640);
      };
      globalThis.addEventListener("resize", handleResize);
      return () => globalThis.removeEventListener("resize", handleResize);
    }

    // Subscribe to media query changes for mobile breakpoint (max-width: 639px)
    const mediaQuery = globalThis.matchMedia("(max-width: 639px)");
    const handleChange = (event: MediaQueryListEvent): void => {
      setIsMobile(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
