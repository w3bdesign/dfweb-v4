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
      toHaveClass(className: string): Assertion;
      toHaveStyle(css: Record<string, any>): Assertion;
    }
  }
}

export {};
