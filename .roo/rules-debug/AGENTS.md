# Project Debug Rules (Non-Obvious Only)

- **AAA Pattern Validation**: Tests fail at runtime if missing `// Arrange`, `// Act`, `// Assert` comments (validated in `jest.setup.ts`)
- **Matrix Component Debug**: Excluded from test coverage - check `package.json` test script for exclusion pattern
- **Custom ESLint Rules**: Debug custom `test-rules/arrange-act-assert` rule in `src/utils/eslint/index.ts`
- **E2E Test Locations**: Cypress tests in `src/e2e/cypress/`, Playwright in `src/e2e/playwright/` (non-standard)
- **Test Environment**: Jest uses `jest-environment-jsdom` with custom setup in `jest.setup.ts`
- **Turbopack Issues**: Dev server uses `--turbopack` flag - may cause different behavior than standard Next.js
- **CSP Debugging**: Custom headers in `next.config.ts` may block resources - check console for CSP violations