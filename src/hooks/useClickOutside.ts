import { useEffect, RefObject } from 'react';

/**
 * Hook that handles clicks outside of the passed ref element
 * @param ref - React ref object for the element to monitor
 * @param callback - Function to call when a click outside occurs
 */
const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void
): void => {
  useEffect(() => {
    const handleClick = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchend', handleClick); // Use touchend for better mobile compatibility

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchend', handleClick);
    };
  }, [ref, callback]); // Re-run effect if ref or callback changes
};

export default useClickOutside;
