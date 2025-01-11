export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Column {
  x: number;
  stackHeight: number;
  stackCounter: number;
}

/**
 * Converts a hex color value to RGB
 * @param {string} hexValue - The hex color value to convert
 * @returns {RGB | null} The RGB color object or null if invalid hex value
 */
export const hexToRgb = (hexValue: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Generates a random integer
 * @param {number} max - The maximum value (exclusive)
 * @returns {number} A random integer between 0 and max-1
 */
export const getRandomInt = (max: number): number => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
};

/**
 * Gets a random character from the tileSet or generates a random ASCII character
 * @param {string[] | null} tileSet - Optional set of characters to choose from
 * @returns {string} A random character
 */
export const getRandomCharacter = (tileSet: string[] | null): string => {
  if (tileSet && Array.isArray(tileSet) && tileSet.length > 0) {
    return tileSet[getRandomInt(tileSet.length)];
  }
  return String.fromCharCode(33 + getRandomInt(94));
};

/**
 * Debounce function
 * @param {T} func - The function to debounce
 * @param {number} wait - The debounce wait time in milliseconds
 * @returns {(...args: Parameters<T>) => void} The debounced function
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};
