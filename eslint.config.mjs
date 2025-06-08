import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import jest from "eslint-plugin-jest";
import testingLibrary from "eslint-plugin-testing-library";
import next from "@next/eslint-plugin-next";

const arrangeActAssertRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce AAA pattern in tests",
      category: "Best Practices",
      recommended: true,
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.name === "it" || node.callee.name === "test") {
          const testFn = node.arguments[1];
          if (testFn && testFn.type === "ArrowFunctionExpression") {
            const comments = context
              .getSourceCode()
              .getCommentsBefore(testFn.body);
            const hasAAA = comments.some(
              (comment) =>
                comment.value.includes("Arrange") ||
                comment.value.includes("Act") ||
                comment.value.includes("Assert"),
            );
            if (!hasAAA) {
              context.report({
                node,
                message: "Test should follow AAA pattern with comments",
              });
            }
          }
        }
      },
    };
  },
};

export default [
  {
    ignores: ["node_modules/", "build/", ".next/", "coverage/"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsEslint,
      "react": react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      "jest": jest,
      "testing-library": testingLibrary,
      "@next/next": next,
      "test-rules": {
        rules: {
          "arrange-act-assert": arrangeActAssertRule,
        },
      },
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...tsEslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...jest.configs.recommended.rules,
      ...testingLibrary.configs["react"].rules,
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      "test-rules/arrange-act-assert": "error",
      "jest/expect-expect": "error",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/valid-expect": "error",
      "testing-library/await-async-queries": "error",
      "testing-library/no-await-sync-queries": "error",
      "testing-library/no-container": "error",
      "testing-library/no-debugging-utils": "warn",
      "testing-library/prefer-screen-queries": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { "argsIgnorePattern": "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "prefer-const": "error",
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          "components": ["Link"],
          "specialLink": ["hrefLeft", "hrefRight"],
          "aspects": ["invalidHref", "preferButton"],
        },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "jsx-a11y/label-has-associated-control": [
        "error",
        {
          "labelComponents": [],
          "labelAttributes": [],
          "controlComponents": [],
          "assert": "either",
          "depth": 25,
        },
      ],
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];
