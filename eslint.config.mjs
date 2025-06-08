import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import jest from "eslint-plugin-jest";
import testingLibrary from "eslint-plugin-testing-library";
import testRules from "eslint-plugin-test-rules";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores(["**/node_modules/", "**/build/", "**/.next/", "**/coverage/"]),
    {
        extends: fixupConfigRules(compat.extends(
            "next/core-web-vitals",
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:react/recommended",
            "plugin:react-hooks/recommended",
            "plugin:jsx-a11y/recommended",
            "plugin:jest/recommended",
            "plugin:testing-library/react",
            "plugin:test-rules/recommended",
        )),

        plugins: {
            "@typescript-eslint": fixupPluginRules(typescriptEslint),
            react: fixupPluginRules(react),
            "jsx-a11y": fixupPluginRules(jsxA11Y),
            jest: fixupPluginRules(jest),
            "testing-library": fixupPluginRules(testingLibrary),
            "test-rules": fixupPluginRules(testRules),
        },

        languageOptions: {
            parser: tsParser,
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        rules: {
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

            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
            }],

            "@typescript-eslint/no-explicit-any": "error",

            "no-console": ["warn", {
                allow: ["warn", "error"],
            }],

            "prefer-const": "error",

            "jsx-a11y/anchor-is-valid": ["error", {
                components: ["Link"],
                specialLink: ["hrefLeft", "hrefRight"],
                aspects: ["invalidHref", "preferButton"],
            }],

            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            "jsx-a11y/label-has-associated-control": ["error", {
                labelComponents: [],
                labelAttributes: [],
                controlComponents: [],
                assert: "either",
                depth: 25,
            }],
        },
    },
    {
        files: ["**/*.test.ts", "**/*.test.tsx"],

        rules: {
            "@typescript-eslint/no-explicit-any": "error",
        },
    },
]);