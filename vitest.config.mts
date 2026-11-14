import path from "node:path";
import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

const root = import.meta.dirname;
const fromRoot = (p: string) => path.resolve(root, p);

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Specific entries come first, because the first match wins.
    alias: [
      {
        find: /^@portabletext\/react$/,
        replacement: fromRoot("src/__mocks__/portabletext-react.tsx"),
      },
      // Next.js provides "server-only" at build time; the package isn't installed, so tests get an empty module.
      {
        find: /^server-only$/,
        replacement: fromRoot("src/__mocks__/server-only.ts"),
      },
      { find: /^src\/utils$/, replacement: fromRoot("src/__mocks__/utils.ts") },
      { find: /^@\//, replacement: `${fromRoot("src")}/` },
      { find: /^src\//, replacement: `${fromRoot("src")}/` },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: [...configDefaults.exclude, "src/e2e/**"],
    coverage: {
      provider: "v8",
      // Same scope as the --collectCoverageFrom flags in the `test` script in package.json.
      include: [
        "src/components/**/*.{js,jsx,ts,tsx}",
        "src/app/api/**/*.{js,ts}",
        "src/lib/csrf.ts",
      ],
      exclude: [
        "src/components/Animations/Matrix.component.{js,jsx,ts,tsx}",
        "src/components/Animations/types/**",
      ],
      // Jest's default reporters, plus json-summary for the Phase 4 comparison.
      reporter: ["clover", "json", "json-summary", "lcov", "text"],
      // Floor measured on 2026-11-12, rounded down. Raise it when coverage improves; never lower it.
      thresholds: {
        statements: 99,
        branches: 91,
        functions: 98,
        lines: 99,
      },
    },
  },
});
