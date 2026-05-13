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
- **Supply Chain Security**: Multi-layered defense — see Security section below

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

## Code Quality Principles

### SOLID Principles

#### Single Responsibility Principle (SRP)

Each component/function should have one reason to change.

- **Components**: Separate UI from business logic (e.g., [`Section.component.tsx`](src/components/Index/Section.component.tsx:1) renders UI, logic lives elsewhere)
- **Functions**: [`actions.ts`](src/app/prosjekter/actions.ts:10) separates data fetching, error handling, and caching into distinct functions
- **Benefits**: Easier testing, clearer purpose, simpler maintenance

#### Open/Closed Principle (OCP)

Software should be open for extension, closed for modification.

- Use composition and props to extend component behavior (e.g., [`Button.component.tsx`](src/components/UI/Button.component.tsx:27) accepts `renderAs` prop for different elements)
- Create generic components that can be customized without modifying source
- **Benefits**: Reduces bugs in existing code, safer feature additions

#### Liskov Substitution Principle (LSP)

Components accepting a type should work with any subtype.

- Ensure prop interfaces are respected by all implementations
- Don't throw unexpected errors or require undocumented props
- **Benefits**: Predictable behavior, safer component hierarchies

#### Interface Segregation Principle (ISP)

Don't force components to depend on props they don't use.

- Create focused prop interfaces (e.g., [`Button.component.tsx`](src/components/UI/Button.component.tsx:3) has targeted props, not a monolithic interface)
- Split large prop types into smaller, composable ones
- **Benefits**: More flexible components, easier to implement and test

#### Dependency Inversion Principle (DIP)

Depend on abstractions, not concrete implementations.

- Use dependency injection for services (e.g., pass clients as props or use context)
- Define abstract types/interfaces, inject implementations
- **Benefits**: Easier testing with mocks, flexible architecture, decoupled code

### DRY Principle (Don't Repeat Yourself)

- Extract repeated UI patterns into reusable components
- Share utility functions (e.g., [`test-utils.ts`](src/utils/test-utils.ts:6) for AAA validation)
- Use custom hooks for shared stateful logic
- Avoid duplicating business logic across components
- **Benefits**: Less code, easier maintenance, fewer bugs, better testing

### KISS Principle (Keep It Simple, Stupid)

- Use React/Next.js built-in features before custom solutions
- Write self-explanatory code with clear naming
- Avoid over-engineering simple problems
- Break complex components into smaller pieces (see `.component.tsx` pattern)
- Minimize dependencies
- Start simple, add complexity only when necessary
- **Benefits**: Easier to understand, faster development, fewer bugs

### YAGNI Principle (You Aren't Gonna Need It)

Don't implement functionality until it's actually needed.

- Focus on current requirements, not hypothetical future needs
- Don't create abstraction layers for single implementations
- Avoid premature optimization before measuring performance
- Don't build configuration systems until configurability is required
- Wait for actual use cases before adding flexibility
- **Benefits**: Less code to maintain, faster delivery, lower complexity, easier to change

### Code Quality Summary

Following these principles results in:

- Maintainable, extendable code
- Fewer bugs and faster debugging
- Better team collaboration
- Professional quality standards
- Easier testing and refactoring

## UI Development Rules

Concise rules for building accessible, fast, delightful UIs. Use MUST/SHOULD/NEVER to guide decisions.

### Interactions

#### Keyboard

- MUST: Full keyboard support per [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)
- MUST: Visible focus rings (`:focus-visible`; group with `:focus-within`)
- MUST: Manage focus (trap, move, and return) per APG patterns

#### Targets & Input

- MUST: Hit target ≥24px (mobile ≥44px) If visual <24px, expand hit area
- MUST: Mobile `<input>` font-size ≥16px or set:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
  ```
- NEVER: Disable browser zoom
- MUST: `touch-action: manipulation` to prevent double-tap zoom; set `-webkit-tap-highlight-color` to match design

#### Inputs & Forms (Behavior)

- MUST: Hydration-safe inputs (no lost focus/value)
- NEVER: Block paste in `<input>/<textarea>`
- MUST: Loading buttons show spinner and keep original label
- MUST: Enter submits focused text input In `<textarea>`, ⌘/Ctrl+Enter submits; Enter adds newline
- MUST: Keep submit enabled until request starts; then disable, show spinner, use idempotency key
- MUST: Don't block typing; accept free text and validate after
- MUST: Allow submitting incomplete forms to surface validation
- MUST: Errors inline next to fields; on submit, focus first error
- MUST: `autocomplete` + meaningful `name`; correct `type` and `inputmode`
- SHOULD: Disable spellcheck for emails/codes/usernames
- SHOULD: Placeholders end with ellipsis and show example pattern (eg, `+1 (123) 456-7890`, `sk-012345…`)
- MUST: Warn on unsaved changes before navigation
- MUST: Compatible with password managers & 2FA; allow pasting one-time codes
- MUST: Trim values to handle text expansion trailing spaces
- MUST: No dead zones on checkboxes/radios; label+control share one generous hit target

#### State & Navigation

- MUST: URL reflects state (deep-link filters/tabs/pagination/expanded panels) Prefer libs like [nuqs](https://nuqs.dev)
- MUST: Back/Forward restores scroll
- MUST: Links are links—use `<a>/<Link>` for navigation (support Cmd/Ctrl/middle-click)

#### Feedback

- SHOULD: Optimistic UI; reconcile on response; on failure show error and rollback or offer Undo
- MUST: Confirm destructive actions or provide Undo window
- MUST: Use polite `aria-live` for toasts/inline validation
- SHOULD: Ellipsis (`…`) for options that open follow-ups (eg, "Rename…")

#### Touch/Drag/Scroll

- MUST: Design forgiving interactions (generous targets, clear affordances; avoid finickiness)
- MUST: Delay first tooltip in a group; subsequent peers no delay
- MUST: Intentional `overscroll-behavior: contain` in modals/drawers
- MUST: During drag, disable text selection and set `inert` on dragged element/containers
- MUST: No "dead-looking" interactive zones—if it looks clickable, it is

#### Autofocus

- SHOULD: Autofocus on desktop when there's a single primary input; rarely on mobile (to avoid layout shift)

### Animation

- MUST: Honor `prefers-reduced-motion` (provide reduced variant)
- SHOULD: Prefer CSS > Web Animations API > JS libraries
- MUST: Animate compositor-friendly props (`transform`, `opacity`); avoid layout/repaint props (`top/left/width/height`)
- SHOULD: Animate only to clarify cause/effect or add deliberate delight
- SHOULD: Choose easing to match the change (size/distance/trigger)
- MUST: Animations are interruptible and input-driven (avoid autoplay)
- MUST: Correct `transform-origin` (motion starts where it "physically" should)

### Layout

- SHOULD: Optical alignment; adjust by ±1px when perception beats geometry
- MUST: Deliberate alignment to grid/baseline/edges/optical centers—no accidental placement
- SHOULD: Balance icon/text lockups (stroke/weight/size/spacing/color)
- MUST: Verify mobile, laptop, ultra-wide (simulate ultra-wide at 50% zoom)
- MUST: Respect safe areas (use env(safe-area-inset-*))
- MUST: Avoid unwanted scrollbars; fix overflows

### Content & Accessibility

- SHOULD: Inline help first; tooltips last resort
- MUST: Skeletons mirror final content to avoid layout shift
- MUST: `<title>` matches current context
- MUST: No dead ends; always offer next step/recovery
- MUST: Design empty/sparse/dense/error states
- SHOULD: Curly quotes (" "); avoid widows/orphans
- MUST: Tabular numbers for comparisons (`font-variant-numeric: tabular-nums` or a mono like Geist Mono)
- MUST: Redundant status cues (not color-only); icons have text labels
- MUST: Don't ship the schema—visuals may omit labels but accessible names still exist
- MUST: Use the ellipsis character `…` (not `...`)
- MUST: `scroll-margin-top` on headings for anchored links; include a "Skip to content" link; hierarchical `<h1–h6>`
- MUST: Resilient to user-generated content (short/avg/very long)
- MUST: Locale-aware dates/times/numbers/currency
- MUST: Accurate names (`aria-label`), decorative elements `aria-hidden`, verify in the Accessibility Tree
- MUST: Icon-only buttons have descriptive `aria-label`
- MUST: Prefer native semantics (`button`, `a`, `label`, `table`) before ARIA
- SHOULD: Right-clicking the nav logo surfaces brand assets
- MUST: Use non-breaking spaces to glue terms: `10&nbsp;MB`, `⌘&nbsp;+&nbsp;K`, `Vercel&nbsp;SDK`

### Performance

- SHOULD: Test iOS Low Power Mode and macOS Safari
- MUST: Measure reliably (disable extensions that skew runtime)
- MUST: Track and minimize re-renders (React DevTools/React Scan)
- MUST: Profile with CPU/network throttling
- MUST: Batch layout reads/writes; avoid unnecessary reflows/repaints
- MUST: Mutations (`POST/PATCH/DELETE`) target <500 ms
- SHOULD: Prefer uncontrolled inputs; make controlled loops cheap (keystroke cost)
- MUST: Virtualize large lists (eg, `virtua`)
- MUST: Preload only above-the-fold images; lazy-load the rest
- MUST: Prevent CLS from images (explicit dimensions or reserved space)

### Design

- SHOULD: Layered shadows (ambient + direct)
- SHOULD: Crisp edges via semi-transparent borders + shadows
- SHOULD: Nested radii: child ≤ parent; concentric
- SHOULD: Hue consistency: tint borders/shadows/text toward bg hue
- MUST: Accessible charts (color-blind-friendly palettes)
- MUST: Meet contrast—prefer [APCA](https://apcacontrast.com/) over WCAG 2
- MUST: Increase contrast on `:hover/:active/:focus`
- SHOULD: Match browser UI to bg
- SHOULD: Avoid gradient banding (use masks when needed)

## Security — Supply Chain Defense

This project uses multi-layered supply chain attack prevention. Agents MUST preserve these measures when modifying configs or workflows.

### Package Installation Defenses

| Defense | Config File | Notes |
|---------|-------------|-------|
| `ignore-scripts=true` | `.npmrc`, `studio/.npmrc` | Blocks post-install scripts; only packages in `allowBuilds` whitelist can run build scripts |
| `allowBuilds` whitelist | `pnpm-workspace.yaml` | Explicit opt-in for packages needing native compilation (@swc/core, cypress, esbuild, etc.) |
| `minimum-release-age=2880` | `.npmrc` | Blocks packages less than 48 hours old; use `--ignore-release-age` for exceptions |
| `block-exotic-subdependencies=true` | `.npmrc` | Prevents transitive deps from linking to GitHub commits, tarballs, or non-registry sources |
| `--frozen-lockfile` | All CI workflows | Prevents lockfile modification during CI installs |
| `engine-strict=true` | `.npmrc` | Fails if Node.js version doesn't match engines field |
| Vulnerability overrides | `studio/package.json` | Known CVEs patched via pnpm overrides |

### Automated Dependency Updates

| Defense | Config File | Notes |
|---------|-------------|-------|
| 7-day minimum release age | `renovate.json` | Automated updates wait 7 days (stricter than manual 48h) |
| OpenSSF Scorecard | `renovate.json` | `security:openssf-scorecard` preset evaluates package health |
| Automerge only for minor/patch | `renovate.json` | Major updates require manual review |

### CI/CD Security

| Defense | Config File | Notes |
|---------|-------------|-------|
| SHA-pinned GitHub Actions | All workflows | All `uses:` references pinned to commit SHAs, never floating tags |
| No `pull_request_target` | All workflows | NEVER use this trigger — it enables cache poisoning attacks |
| Least-privilege permissions | All workflows | Every workflow specifies minimal `permissions` block |
| No cache `restore-keys` fallbacks | Workflows with caching | Prevents stale/poisoned cache restoration from other branches |
| Pinned global installs | `repomix.yml` | Global npm packages pinned to exact versions |
| Lockfile-backed studio installs | `snyk-scan.yml` | Uses `npm ci` with committed `package-lock.json` |

### Security Scanning

| Tool | Workflow | Purpose |
|------|----------|---------|
| Snyk | `snyk-scan.yml` | Dependency vulnerability scanning + monitoring |
| Trivy | `security.yml` | Filesystem vulnerability scanning (CRITICAL/HIGH) |
| Semgrep | `security.yml` | SAST with OWASP, JS, TS, React rulesets + custom rules in `.semgrep/` |
| CodeQL | `codeql.yml` | GitHub native code analysis with security-and-quality queries |
| Gitleaks | `security.yml` | Secret detection in commits |

### Rules for Agents

- **NEVER** add `pull_request_target` to any workflow
- **NEVER** use floating tags for GitHub Actions (always pin to SHA)
- **NEVER** use `npm install -g <package>` without a pinned version in CI
- **NEVER** add `restore-keys` fallbacks to cache steps in workflows
- **NEVER** remove `ignore-scripts=true` from `.npmrc`
- **ALWAYS** use `--frozen-lockfile` for pnpm installs in CI
- **ALWAYS** add explicit `permissions` blocks to new workflows
- When adding a package that needs build scripts, add it to `allowBuilds` in `pnpm-workspace.yaml`
- Full hardening plan available at `plans/supply-chain-hardening.md`