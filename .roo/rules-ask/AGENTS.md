# Project Documentation Rules (Non-Obvious Only)

- **Component Naming**: `.component.tsx` suffix used instead of standard React naming convention
- **Test Structure**: E2E tests in `src/e2e/cypress/` and `src/e2e/playwright/` (not standard `__tests__` or `test/` folders)
- **Custom ESLint Plugin**: Local plugin at `src/utils/eslint/` - not a published package
- **AAA Pattern**: Mandatory test comments enforced by both ESLint AND runtime validation
- **Matrix Component**: Intentionally excluded from test coverage (see package.json script)
- **Sanity Configuration**: Uses hardcoded fallback values (projectId: "41s7iutf", dataset: "production")
- **CSP Configuration**: Custom headers allow `https://presentasjon.dfweb.no` for iframe embedding
- **Development Setup**: Uses Turbopack (`--turbopack` flag) instead of standard webpack
- **Refresh Command**: `pnpm refresh` does complete cleanup including store prune and lock file removal