import {
  hexToRgb,
  getRandomInt,
  getRandomCharacter,
  debounce,
} from "@/components/Animations/Matrix.utils";

describe("Matrix Utils", () => {
  describe("hexToRgb", () => {
    it("converts valid hex color to RGB", () => {
      // Arrange
      const hexColors = ["#ff0000", "#00ff00", "#0000ff", "#ffffff"];
      const expectedResults = [
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
        { r: 255, g: 255, b: 255 },
      ];

      // Act & Assert
      hexColors.forEach((hex, index) => {
        expect(hexToRgb(hex)).toStrictEqual(expectedResults[index]);
      });
    });

    it("returns null for invalid hex colors", () => {
      // Arrange
      const invalidHexColors = ["invalid", "#12", "#1234", "#12345"];

      // Act & Assert
      invalidHexColors.forEach((hex) => {
        expect(hexToRgb(hex)).toBeNull();
      });
    });
  });

  describe("getRandomInt", () => {
    it("returns a random integer within the range", () => {
      // Arrange
      const max = 10;
      const mockGetRandomValues = jest
        .spyOn(window.crypto, "getRandomValues")
        .mockImplementation((array) => {
          if (array instanceof Uint32Array) {
            array[0] = 123456789;
          }
          return array as Uint32Array;
        });

      // Act
      const result = getRandomInt(max);

      // Assert
      expect(result).toBe(9); // 123456789 % 10 = 9
      expect(mockGetRandomValues).toHaveBeenCalledWith(expect.any(Uint32Array));

      // Cleanup
      mockGetRandomValues.mockRestore();
    });
  });

  describe("getRandomCharacter", () => {
    it("returns a character from the provided tileSet", () => {
      // Arrange
      const tileSet = ["A", "B", "C"];
      const mockGetRandomValues = jest
        .spyOn(window.crypto, "getRandomValues")
        .mockImplementation((array) => {
          if (array instanceof Uint32Array) {
            array[0] = 1; // This will return index 1 % 3 = 1, so "B"
          }
          return array as Uint32Array;
        });

      // Act
      const result = getRandomCharacter(tileSet);

      // Assert
      expect(result).toBe("B");
      mockGetRandomValues.mockRestore();
    });

    it("returns fallback character when tileSet access returns undefined", () => {
      // Arrange
      const tileSet = ["A"];
      const mockGetRandomValues = jest
        .spyOn(window.crypto, "getRandomValues")
        .mockImplementation((array) => {
          if (array instanceof Uint32Array) {
            array[0] = 999; // This will cause out-of-bounds access
          }
          return array as Uint32Array;
        });

      // Act
      const result = getRandomCharacter(tileSet);

      // Assert
      expect(result).toBe("A"); // Should fall back to tileSet[0]
      mockGetRandomValues.mockRestore();
    });

    it("returns empty string when tileSet and fallbacks are undefined", () => {
      // Arrange
      const tileSet: string[] = [];
      Object.defineProperty(tileSet, "0", { value: undefined });
      const mockGetRandomValues = jest
        .spyOn(window.crypto, "getRandomValues")
        .mockImplementation((array) => {
          if (array instanceof Uint32Array) {
            array[0] = 0;
          }
          return array as Uint32Array;
        });

      // Act
      const result = getRandomCharacter(tileSet);

      // Assert
      expect(result).toBe(""); // Should fall back to empty string
      mockGetRandomValues.mockRestore();
    });

    it("returns a random ASCII character when tileSet is null", () => {
      // Arrange
      const mockGetRandomValues = jest
        .spyOn(window.crypto, "getRandomValues")
        .mockImplementation((array) => {
          if (array instanceof Uint32Array) {
            array[0] = 50; // This will generate a specific ASCII character
          }
          return array as Uint32Array;
        });

      // Act
      const result = getRandomCharacter(null);

      // Assert
      expect(result).toMatch(/^[\x21-\x7E]$/); // ASCII printable characters
      mockGetRandomValues.mockRestore();
    });

    it("returns a random ASCII character when tileSet is empty", () => {
      // Arrange
      const mockGetRandomValues = jest
        .spyOn(window.crypto, "getRandomValues")
        .mockImplementation((array) => {
          if (array instanceof Uint32Array) {
            array[0] = 25;
          }
          return array as Uint32Array;
        });

      // Act
      const result = getRandomCharacter([]);

      // Assert
      expect(result).toMatch(/^[\x21-\x7E]$/); // ASCII printable characters
      mockGetRandomValues.mockRestore();
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("debounces function calls", () => {
      // Arrange
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100);

      // Act
      debouncedFunc();
      debouncedFunc();
      debouncedFunc();
      expect(func).not.toHaveBeenCalled();
      jest.runAllTimers();

      // Assert
      expect(func).toHaveBeenCalledTimes(1);
    });

    it("calls function with correct arguments", () => {
      // Arrange
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100);
      const args = ["test", 123];

      // Act
      debouncedFunc(...args);
      jest.runAllTimers();

      // Assert
      expect(func).toHaveBeenCalledWith(...args);
    });
  });
});
