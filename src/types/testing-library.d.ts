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
    toHaveStyle(css: Record<string, any>): R;
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
      toHaveStyle(css: Record<string, any>): Assertion;
      toHaveBeenCalled(): any;
      toHaveBeenCalledWith(...args: any[]): any;
      toHaveBeenCalledTimes(n: number): any;
      toBe(expected: any): any;
      toEqual(expected: any): any;
      toBeNull(): any;
      toBeDefined(): any;
      toBeGreaterThan(n: number): any;
      toBeLessThanOrEqual(n: number): any;
      toMatch(pattern: RegExp | string): any;
      toThrow(error?: string | Error | RegExp): any;
      toContain(item: any): any;
      toContainElement(element: any): any;
      toContainHTML(html: string): any;
      toHaveLength(length: number): any;

      rejects: {
        toThrow(error?: string | Error | RegExp): Promise<any>;
      };
    }

    interface ExpectStatic {
      any(constructor: any): any;
    }
  }

  // Add canvas mocking support
  interface HTMLCanvasElement {
    getContext(contextId: "2d"): any;
  }
}

export {};
