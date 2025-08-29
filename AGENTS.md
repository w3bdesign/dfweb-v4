# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Non-Obvious Project Patterns

- **Custom ESLint Plugin**: Uses local `eslint-plugin-test-rules` from `src/utils/eslint/` - enforces AAA pattern in tests
- **Mandatory AAA Comments**: All tests MUST include `// Arrange`, `// Act`, `// Assert` comments or builds fail
- **Test Coverage Exclusion**: Matrix.component.tsx excluded from coverage via package.json script
- **Custom Test Validation**: `jest.setup.ts` validates AAA pattern at runtime using `src/utils/test-utils.ts`
- **Turbopack Development**: Uses `--turbopack` flag for dev server (non-standard Next.js setup)
- **Component Naming**: Components use `.component.tsx` suffix (not standard React convention)
- **Custom CSP Headers**: Allows `https://presentasjon.dfweb.no` for iframe embedding in `next.config.ts`
- **Sanity Defaults**: Hardcoded fallback values in client config (projectId: "41s7iutf", dataset: "production")
- **E2E Test Structure**: Cypress tests in `src/e2e/cypress/`, Playwright in `src/e2e/playwright/` (not standard locations)
- **Custom Refresh Script**: `pnpm refresh` does full cleanup including store prune and lock file removal

## Critical Commands

- **Single Test**: `jest --testNamePattern="test name"` (no built-in script)
- **Coverage**: `jest --coverage --collectCoverageFrom='src/components/**/*.{js,jsx,ts,tsx}' --collectCoverageFrom='!src/components/Animations/Matrix.component.{js,jsx,ts,tsx}'`
- **E2E**: `start-test dev 3000 cypress:headless` (requires dev server running)
- **Lighthouse Variants**: `lhci:perf`, `lhci:desktop` for specific performance testing

## Testing Gotchas

- AAA pattern enforced by both ESLint rule AND runtime validation in jest.setup.ts
- Test files outside `src/e2e/` must follow AAA pattern or fail
- Matrix component intentionally excluded from test coverage
- Cypress and Playwright have different ESLint rule overrides