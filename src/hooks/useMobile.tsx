import { useState, useEffect } from "react";

/**
 * A React hook that returns a boolean indicating if the user is on a mobile device.
 * The determination uses window.innerWidth < 640 as a threshold.
 *
 * @returns true if the device width is under 640px, else false.
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return isMobile;
}
