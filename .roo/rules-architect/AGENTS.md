# Project Architecture Rules (Non-Obvious Only)

- **Component Architecture**: Uses `.component.tsx` suffix pattern throughout (not standard React convention)
- **Test Architecture**: Dual enforcement of AAA pattern via ESLint plugin AND runtime validation
- **Custom ESLint Plugin**: Local plugin architecture in `src/utils/eslint/` with custom rule implementation
- **Matrix Component**: Intentionally excluded from test coverage architecture (performance component)
- **E2E Test Architecture**: Split between Cypress (`src/e2e/cypress/`) and Playwright (`src/e2e/playwright/`)
- **CSP Architecture**: Custom security headers allow specific iframe embedding for `https://presentasjon.dfweb.no`
- **Sanity Architecture**: Hardcoded fallback configuration prevents runtime failures
- **Development Architecture**: Turbopack integration changes standard Next.js build pipeline
- **Testing Architecture**: Runtime AAA validation in `jest.setup.ts` prevents pattern violations