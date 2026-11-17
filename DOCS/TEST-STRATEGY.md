# Test Strategy

This document describes how dfweb-v4 is tested: what we test, with which tool, where it runs and what must be green before merging. Hard rules are listed in the Enforced Rules table in [`AGENTS.md`](../AGENTS.md); this document explains why they exist.

## 1. Scope and quality goals

**In scope:** the Next.js app in `src/` (pages, components, hooks, `lib`), the API routes in `src/app/api/`, the CSP and security headers in `next.config.ts`, and the CI pipelines.

**Out of scope:** the Sanity Studio in `studio/` (it has its own tooling) and the behaviour of third-party services (see section 9).

| Goal | Target | Measured by |
| --- | --- | --- |
| Correctness | Every route returns the documented status codes | Vitest route tests, Playwright `api.spec.ts` |
| Security | CSRF and the revalidate secret cannot be bypassed | Vitest (`csrf.test.ts`, `revalidate.test.ts`), Semgrep, CodeQL |
| Accessibility | No axe violations on any page, full keyboard support | cypress-axe, pa11y, Vitest keyboard tests |
| Performance | Lighthouse budgets in `lighthouserc.json` and `.github/workflows/budget.json` | Lighthouse CI |
| Regression safety | Coverage at or above the floor in `vitest.config.mts` | Vitest coverage in CircleCI, Codecov |

## 2. Test layers

| Layer | Tool | Owns these risks | Runs in |
| --- | --- | --- | --- |
| Static | TypeScript (`next build`), Prettier, Stylelint, ESLint | Type errors, style drift | `lint.yml`, every E2E workflow (build step) |
| Architecture | Vitest (`src/__tests__/architecture`) | Layer violations, naming, test code leaking into production | `lint.yml`, CircleCI |
| Unit / component | Vitest + React Testing Library (jsdom) | Component logic, rendering states, hooks, CMS data mapping | CircleCI (`pnpm test`) |
| API / integration | Vitest with `@vitest-environment node` + `NextRequest` | Route status codes, CSRF token lifecycle, revalidate auth, contract between `/api/csrf-token` and `/api/form` | CircleCI (`pnpm test`) |
| Component (browser) | Cypress component tests (`src/e2e/cypress/component`) | Rendering in a real browser engine | Cypress workflow |
| Smoke + a11y | Cypress + cypress-axe (`src/e2e/cypress/e2e`) | A page fails to load, axe violations | `cypress.yml` (Chrome, Firefox, Edge) |
| User journeys + HTTP | Playwright (`src/e2e/playwright`) | Broken flows, network failure handling, real HTTP pipeline | `playwright.yml` (Chromium, Firefox) |
| Accessibility audit | pa11y | WCAG issues axe can miss on the built site | `pa11y.yml` |
| Performance | Lighthouse CI | Performance, SEO and best-practice regressions | `lighthouse.yml` |
| Security | Semgrep, CodeQL, Trivy, Gitleaks, Snyk | Vulnerable code patterns, CVEs, leaked secrets | `security.yml`, `codeql.yml`, `snyk-scan.yml` |

The pyramid is deliberately bottom-heavy: most checks are fast Vitest tests. E2E tests cover only what needs a real browser or server.

## 3. Risk matrix

Likelihood and impact are rated 1 (low) to 3 (high). Risk = likelihood × impact.

| Area | Risk | L | I | Risk | Covered by |
| --- | --- | --- | --- | --- | --- |
| Contact form / CSRF | CSRF bypass, or an expired or forged token is accepted | 2 | 3 | **6** | Vitest `csrf.test.ts`, `form.test.ts` (expired, tampered, malformed, contract), Playwright `api.spec.ts` |
| Contact form / CSRF | User can't send the form, or gets no feedback on failure | 2 | 3 | **6** | Playwright `kontakt.spec.ts` (200, 500, abort, in-flight state), Vitest `ContactForm.test.tsx` |
| Contact form / CSRF | Client and server validation drift apart | 2 | 2 | 4 | Shared Zod schema, Vitest `form.test.ts`, Playwright validation cases |
| Revalidate webhook | Unauthenticated cache purge (DoS / content tampering) | 1 | 3 | 3 | Vitest `revalidate.test.ts` (all 401 branches), Playwright negative cases |
| Revalidate webhook | Wrong revalidation mode, so stale content stays live | 2 | 2 | 4 | Vitest `revalidate.test.ts` (mocked `next/cache`) |
| CMS content fetching | Sanity is down or returns an unexpected shape, so a page crashes | 2 | 3 | **6** | Vitest `content.test.ts`, route `error.tsx` tests, ErrorBoundary tests |
| Navigation / a11y | Keyboard trap, missing labels, contrast regressions | 2 | 2 | 4 | cypress-axe per page, pa11y, Vitest `KeyboardNavigation.test.tsx` |
| Navigation / a11y | Broken links or mobile menu | 1 | 2 | 2 | Cypress `layout.cy.ts`, Vitest `Header`/`MobileMenu` tests |
| Performance | Bundle growth or LCP regression | 2 | 2 | 4 | Lighthouse CI budgets |
| Animations | Animation ignores `prefers-reduced-motion` or blocks interaction | 2 | 1 | 2 | Vitest animation tests (`FadeIn`, `Grow`, `MatrixCursor` …) |

Items with risk ≥ 6 must have tests at two layers (unit/API **and** E2E).

## 4. Why both Cypress and Playwright

The two tools overlap, so each has a fixed job to avoid writing the same test twice:

| Tool | Responsibility |
| --- | --- |
| **Playwright** | Cross-browser user journeys, network mocking (`page.route`) and API/HTTP tests (the `request` fixture). |
| **Cypress** | Component tests, accessibility (cypress-axe) and one smoke check per page. |

New tests go to the tool that owns the concern. Existing Cypress tests that predate this split are kept, but new journey or network tests belong in Playwright.

## 5. Entry and exit criteria for merging

**Entry (a PR is ready for review when):**

- The change has tests at the layer(s) from section 2 that own the affected risk.
- Every new Vitest test has `// Arrange`, `// Act`, `// Assert` comments.
- Bug fixes include a regression test (section 7).

**Exit (a PR may be merged when all of these are green):**

| Check | Where |
| --- | --- |
| `pnpm format:check`, `pnpm lint:css`, architecture tests | `lint.yml` |
| `pnpm test` with coverage at or above **statements 99, branches 91, functions 98, lines 99** | CircleCI |
| `next build` (no type errors) | Playwright, Cypress, pa11y and Lighthouse workflows |
| Playwright tests | `playwright.yml` |
| Cypress smoke + a11y | `cypress.yml` |
| pa11y and Lighthouse budgets | `pa11y.yml`, `lighthouse.yml` |
| No new HIGH/CRITICAL security findings | `security.yml`, `codeql.yml` |

Coverage scope: `src/components/**`, `src/app/api/**` and `src/lib/csrf.ts` (Matrix animation excluded). Never lower the floor; raise it when coverage improves.

## 6. Test data and mocking

- **Fixtures** live in `src/__mocks__/` (shared JSON for projects, hero, links, …) and next to the tests (for example `src/__tests__/Index/fixtures/`).
- **Sanity:** Vitest mocks `@/lib/sanity/client` so no test calls the real CMS.
- **EmailJS:** Vitest mocks `@emailjs/browser`. Playwright intercepts `**/api.emailjs.com/**` with `page.route`, so no real email is ever sent.
- **`next/cache`:** mocked in the revalidate tests so the revalidation mode can be asserted.
- **Secrets:** tests generate `CSRF_SECRET` and `REVALIDATE_SECRET` with `randomBytes` at runtime. Never commit a secret literal (Semgrep blocks it).
- **Time:** CSRF expiry is tested by spying on `Date.now`, not by waiting.
- **Test inputs** use Norwegian data (names with æøå, 8-digit phone numbers) to match production validation.

## 7. Defect management

**Severity** describes technical impact (set by the reporter). **Priority** describes how soon we fix it (set during triage). They are independent: a typo on the front page can be S4/P2, and a crash in a hidden dev page can be S2/P3.

| Severity | Meaning | Example |
| --- | --- | --- |
| S1 Critical | Site down, security hole, data loss | CSRF check bypassed |
| S2 Major | Core journey broken, no workaround | Contact form can't be sent |
| S3 Minor | Broken with a workaround, or a single-page a11y/visual defect | Focus ring missing on one button |
| S4 Trivial | Cosmetic | Typo, console warning |

| Priority | Meaning |
| --- | --- |
| P1 | Fix now, blocks release |
| P2 | Next release |
| P3 | Backlog |
| P4 | Won't fix / nice to have |

**Lifecycle:** New → Triaged (severity + priority set) → In progress → In review (fix + regression test) → Done (merged and deployed). It goes to Won't fix only with a written reason.

**Rule:** every fixed bug gets a regression test that fails without the fix and passes with it. Link the test in the issue (the bug report template has a field for it).

## 8. Environments

- **Local:** `pnpm test`, `pnpm dev` + `pnpm exec playwright test` / `pnpm cypress:open`.
- **CI:** GitHub Actions for lint, E2E, a11y, performance and security. CircleCI for Vitest + coverage upload to Codecov.
- E2E runs against a production build (`pnpm build`) wherever the workflow allows it, so the tests see the same CSP and bundling as production.

## 9. Deliberately not tested

| What | Why |
| --- | --- |
| `Matrix.component.tsx` (canvas animation) | Purely visual canvas drawing with `requestAnimationFrame`; jsdom has no real canvas, so assertions would only test the mocks. Its helpers (`Matrix.utils`, renderer) *are* tested, and the component is excluded from coverage on purpose. |
| The Sanity API itself | Third-party service with its own SLA. We test our handling of its responses (success, empty, error) with mocks, not Sanity's uptime or query engine. |
| The EmailJS API itself | Same reasoning. We mock it and test our success, error and network-failure handling. Sending real emails from CI would cost quota and spam the inbox. |
| Revalidate success paths in E2E | `REVALIDATE_SECRET` isn't set in CI, so E2E checks only the rejection paths. The success paths are covered by Vitest. |
