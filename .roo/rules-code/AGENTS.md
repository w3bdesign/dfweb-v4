# Project Coding Rules (Non-Obvious Only)

- **AAA Pattern Enforcement**: Tests MUST include `// Arrange`, `// Act`, `// Assert` comments - enforced by custom ESLint plugin in `src/utils/eslint/` AND runtime validation in `jest.setup.ts`
- **Component Naming**: Use `.component.tsx` suffix (not standard React convention)
- **Matrix Component**: Intentionally excluded from test coverage via package.json script
- **Custom ESLint Plugin**: Local plugin at `src/utils/eslint/` provides `test-rules/arrange-act-assert` rule
- **Test Utils**: Use `checkAAAPattern()` from `src/utils/test-utils.ts` for AAA validation
- **Sanity Client**: Hardcoded fallbacks in `src/lib/sanity/client.ts` (projectId: "41s7iutf", dataset: "production")
- **CSP Headers**: Custom Content Security Policy allows `https://presentasjon.dfweb.no` for iframe embedding
- **Turbopack Dev**: Development server uses `--turbopack` flag (non-standard Next.js setup)
- **Supply Chain Security**: Multi-layered defense — see `AGENTS.md` Security section and `plans/supply-chain-hardening.md`
- **NEVER** add `pull_request_target` to any workflow, use floating tags for GitHub Actions, or remove `ignore-scripts=true` from `.npmrc`
- **ALWAYS** pin GitHub Actions to SHA, use `--frozen-lockfile` in CI, add `permissions` blocks to workflows