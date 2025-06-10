/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

// Extend Jest matchers
declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveTextContent(text: string): R;
    toBeVisible(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toHaveAttribute(attr: string, value?: string): R;
    toHaveClass(className: string): R;
    toHaveStyle(css: React.CSSProperties): R;
  }
}

// Augment Chai assertions for Cypress
declare global {
  namespace Chai {
    interface Assertion {
      toBeInTheDocument(): Assertion;
      toHaveTextContent(text: string): Assertion;
      toBeVisible(): Assertion;
      toBeDisabled(): Assertion;
      toBeEnabled(): Assertion;
      toHaveAttribute(attr: string, value?: string): Assertion;
      toHaveClass(...classNames: string[]): Assertion;
      toHaveStyle(css: React.CSSProperties): Assertion;
      toHaveBeenCalled(): Assertion;
      toHaveBeenCalledWith(...args: unknown[]): Assertion;
      toHaveBeenCalledTimes(n: number): Assertion;
      toBe(expected: unknown): Assertion;
      toEqual(expected: unknown): Assertion;
      toBeNull(): Assertion;
      toBeDefined(): Assertion;
      toBeGreaterThan(n: number): Assertion;
      toBeLessThanOrEqual(n: number): Assertion;
      toMatch(pattern: RegExp | string): Assertion;
      toThrow(error?: string | Error | RegExp): Assertion;
      toContain(item: unknown): Assertion;
      toContainElement(element: HTMLElement): Assertion;
      toContainHTML(html: string): Assertion;
      toHaveLength(length: number): Assertion;

      rejects: {
        toThrow(error?: string | Error | RegExp): Promise<void>;
      };
    }

    interface ExpectStatic {
      any<T>(classType: new (...args: unknown[]) => T): unknown;
    }
  }

  // Add canvas mocking support
  interface HTMLCanvasElement {
    getContext(contextId: "2d"): CanvasRenderingContext2D | null;
  }
}

export {};
