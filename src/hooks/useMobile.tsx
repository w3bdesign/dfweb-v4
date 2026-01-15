import { useState, useEffect } from "react";

/**
 * A React hook that returns a boolean indicating if the user is on a mobile device.
 * Uses matchMedia to subscribe to breakpoint changes instead of resize events,
 * aligning with React best practices for derived state subscriptions.
 *
 * @returns true if the device width is under 640px, else false.
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Create media query for mobile breakpoint (max-width: 639px)
    // Using 639px to match the original logic (< 640)
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    
    // Set initial state based on current match
    setIsMobile(mediaQuery.matches);

    // Handler for when the media query match changes
    const handleChange = (event: MediaQueryListEvent): void => {
      setIsMobile(event.matches);
    };

    // Subscribe to changes
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup subscription
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
