# React Best Practices Audit (Vercel agent-skills)

Scope: **Strictly** the rules in [`agent-skills/skills/react-best-practices/rules/`](agent-skills/skills/react-best-practices/rules/_sections.md:1).

Repo: `dfweb-v4`

## How to read impact labels
The **Impact** labels (CRITICAL/HIGH/MEDIUM/LOW) shown per section/rule are copied from the Vercel agent-skills guidance (see [`_sections.md`](agent-skills/skills/react-best-practices/rules/_sections.md:1) and each rule’s frontmatter). They indicate how important the practice *typically* is for performance.

They are **not** a statement that this repo is currently “critical” or broken. The repo-specific assessment is the **Status** field below (Pass/Partial/Fail).

Legend:
- **Pass**: We follow the rule consistently (or there is no meaningful place it applies).
- **Partial**: We follow some aspects, but there are notable gaps or inconsistent usage.
- **Fail**: We generally do not follow it where it applies, or there is a clear instance that contradicts it.

---

## 1) Eliminating Waterfalls (async) — Impact: CRITICAL

### Promise.all() for Independent Operations — [`async-parallel.md`](agent-skills/skills/react-best-practices/rules/async-parallel.md:1)
**Status: Pass**
- Uses parallel data fetch in server component/layout:
  - [`src/app/RootLayout.tsx`](src/app/RootLayout.tsx:1) (uses `Promise.all`)

### Defer await for dependent operations — [`async-defer-await.md`](agent-skills/skills/react-best-practices/rules/async-defer-await.md:1)
**Status: Partial**
- Evidence of good patterns (preloading + Suspense):
  - [`preloadProjects()`](src/app/prosjekter/actions.ts:51) called early in [`Prosjekter()`](src/app/prosjekter/page.tsx:29)
  - Suspense boundary wrapping async list: [`<Suspense fallback>`](src/app/prosjekter/page.tsx:41)
- Still needs a repo-wide check for sequential `await` patterns in server components/actions.

### Avoid async dependencies/waterfalls — [`async-dependencies.md`](agent-skills/skills/react-best-practices/rules/async-dependencies.md:1)
**Status: Partial**
- Known good example: `Promise.all` in [`src/app/RootLayout.tsx`](src/app/RootLayout.tsx:1)
- Need to verify other server components/routes for sequential dependency chains.

### Use Suspense boundaries to prevent waterfall rendering — [`async-suspense-boundaries.md`](agent-skills/skills/react-best-practices/rules/async-suspense-boundaries.md:1)
**Status: Pass**
- Suspense is used for project list with a clear loading UI:
  - [`src/app/prosjekter/page.tsx`](src/app/prosjekter/page.tsx:1)

### API routes: avoid internal roundtrips (server calling own API) — [`async-api-routes.md`](agent-skills/skills/react-best-practices/rules/async-api-routes.md:1)
**Status: Pass**
- No evidence in scanned files of server components fetching from local API routes; data fetching uses Sanity client directly:
  - [`src/app/prosjekter/actions.ts`](src/app/prosjekter/actions.ts:1)

---

## 2) Bundle Size Optimization (bundle) — Impact: CRITICAL

### Avoid Barrel File Imports — [`bundle-barrel-imports.md`](agent-skills/skills/react-best-practices/rules/bundle-barrel-imports.md:1)
**Status: Partial**
- Potential issue: `react-icons` is explicitly called out by the rule as commonly affected.
- Current imports are **subpath** imports (good) but still worth checking overall strategy:
  - `react-icons` base import: [`IconContext`](src/components/Layout/Footer.component.tsx:3)
  - Subpath imports: [`BiCopyright`](src/components/Layout/Footer.component.tsx:4), [`FaReact/FaVuejs/FaPhp`](src/components/Index/Icons.component.tsx:2), [`SiTypescript/SiWordpress`](src/components/Index/Icons.component.tsx:3)

### Dynamic Imports for Heavy Components — [`bundle-dynamic-imports.md`](agent-skills/skills/react-best-practices/rules/bundle-dynamic-imports.md:1)
**Status: Pass**
- Heavy animation component is dynamically imported with `ssr: false`:
  - [`src/components/Index/Hero.component.tsx`](src/components/Index/Hero.component.tsx:1)
- Route-level dynamic imports used on index page:
  - [`src/app/page.tsx`](src/app/page.tsx:1)

### Conditional/lazy loading for optional code — [`bundle-conditional.md`](agent-skills/skills/react-best-practices/rules/bundle-conditional.md:1)
**Status: Pass**
- Dynamic import patterns in use for optional/heavy UI on initial render:
  - [`src/app/page.tsx`](src/app/page.tsx:1)
  - [`src/components/Index/Hero.component.tsx`](src/components/Index/Hero.component.tsx:1)

### Defer third-party scripts — [`bundle-defer-third-party.md`](agent-skills/skills/react-best-practices/rules/bundle-defer-third-party.md:1)
**Status: Unknown (needs confirmation)**
- Not yet audited for analytics/third-party scripts usage.

### Preload critical code — [`bundle-preload.md`](agent-skills/skills/react-best-practices/rules/bundle-preload.md:1)
**Status: Pass**
- Explicit data preloading used for projects list:
  - [`preloadProjects()`](src/app/prosjekter/actions.ts:51) called from [`src/app/prosjekter/page.tsx`](src/app/prosjekter/page.tsx:29)

---

## 3) Server-Side Performance (server) — Impact: HIGH

### Per-Request Deduplication with React.cache() — [`server-cache-react.md`](agent-skills/skills/react-best-practices/rules/server-cache-react.md:1)
**Status: Pass**
- Uses `cache()` for per-request dedupe:
  - [`getProjects`](src/app/prosjekter/actions.ts:43)

### Parallel server fetching — [`server-parallel-fetching.md`](agent-skills/skills/react-best-practices/rules/server-parallel-fetching.md:1)
**Status: Pass**
- Parallel fetch at layout level:
  - [`src/app/RootLayout.tsx`](src/app/RootLayout.tsx:1)

### Non-blocking post-response work — [`server-after-nonblocking.md`](agent-skills/skills/react-best-practices/rules/server-after-nonblocking.md:1)
**Status: Unknown (needs confirmation)**
- Not yet audited for `after()` usage / background tasks.

### LRU caching for expensive server computations — [`server-cache-lru.md`](agent-skills/skills/react-best-practices/rules/server-cache-lru.md:1)
**Status: Unknown (needs confirmation)**
- Not yet audited; current visible caching is `cache()` + Next revalidate.

### Minimize serialization across server/client boundary — [`server-serialization.md`](agent-skills/skills/react-best-practices/rules/server-serialization.md:1)
**Status: Partial**
- Positive: server-only boundary enforced in actions:
  - [`import "server-only"`](src/app/prosjekter/actions.ts:2)
- Needs a sweep of props passed from server components to client components to ensure they’re primitives/lean objects.

---

## 4) Client-Side Data Fetching (client) — Impact: MEDIUM-HIGH

### SWR subscription for deduping listeners — [`client-event-listeners.md`](agent-skills/skills/react-best-practices/rules/client-event-listeners.md:1)
**Status: Partial**
- We do attach global listeners in hooks/components:
  - [`useMobile()` adds a window resize listener](src/hooks/useMobile.tsx:12)
  - [`Matrix.component.tsx` adds a window resize listener](src/components/Animations/Matrix.component.tsx:119)
- This is likely fine because these are used in limited places, but the rule suggests centralizing/deduping if many instances exist.

### Client deduplication with SWR — [`client-swr-dedup.md`](agent-skills/skills/react-best-practices/rules/client-swr-dedup.md:1)
**Status: Pass (not applicable)**
- No SWR usage in currently reviewed code; client fetching appears minimal.

---

## 5) Re-render Optimization (rerender) — Impact: MEDIUM

### Subscribe to Derived State — [`rerender-derived-state.md`](agent-skills/skills/react-best-practices/rules/rerender-derived-state.md:1)
**Status: Partial**
- `useMobile()` re-runs state update on every resize event (can be many):
  - [`src/hooks/useMobile.tsx`](src/hooks/useMobile.tsx:12)
- Improvement path: use `matchMedia('(max-width: 639px)')` and only update when boolean changes.

### Correct dependencies in hooks — [`rerender-dependencies.md`](agent-skills/skills/react-best-practices/rules/rerender-dependencies.md:1)
**Status: Pass**
- Example of correct functional update to avoid stale closures and reduce deps:
  - [`setTrails((currentTrails) => ...)`](src/components/Animations/MatrixCursor.component.tsx:50)
- Effect deps appear accurate in inspected components:
  - [`MatrixCursor` effect deps](src/components/Animations/MatrixCursor.component.tsx:61)

### Avoid derived state duplication — [`rerender-derived-state.md`](agent-skills/skills/react-best-practices/rules/rerender-derived-state.md:1)
**Status: Partial**
- Similar note as above: derived state is fine, but derived from continuous resize stream.

### Functional setState — [`rerender-functional-setstate.md`](agent-skills/skills/react-best-practices/rules/rerender-functional-setstate.md:1)
**Status: Pass**
- Uses functional updates where concurrent updates can happen:
  - [`setTrails((currentTrails) => ...)`](src/components/Animations/MatrixCursor.component.tsx:50)

### Lazy state initialization — [`rerender-lazy-state-init.md`](agent-skills/skills/react-best-practices/rules/rerender-lazy-state-init.md:1)
**Status: Pass**
- Uses lazy init for tab selection:
  - [`useState(() => tabs[0]?.id ?? "")`](src/components/UI/Tabs.component.tsx:112)

### Memoization — [`rerender-memo.md`](agent-skills/skills/react-best-practices/rules/rerender-memo.md:1)
**Status: Partial**
- Some memoization exists (`useCallback`) for hot-path handlers:
  - [`MatrixCursor` callbacks](src/components/Animations/MatrixCursor.component.tsx:35)
  - [`Matrix` callbacks](src/components/Animations/Matrix.component.tsx:55)
- Need to verify other components for expensive derived values; not enough evidence either way.

### Defer reads / transitions — [`rerender-defer-reads.md`](agent-skills/skills/react-best-practices/rules/rerender-defer-reads.md:1), [`rerender-transitions.md`](agent-skills/skills/react-best-practices/rules/rerender-transitions.md:1)
**Status: Unknown (needs confirmation)**
- Not yet audited for `useTransition`, `startTransition`, `useDeferredValue`, or read deferral patterns.

---

## 6) Rendering Performance (rendering) — Impact: MEDIUM

### Hoist static JSX — [`rendering-hoist-jsx.md`](agent-skills/skills/react-best-practices/rules/rendering-hoist-jsx.md:1)
**Status: Partial**
- Some static structures exist but not explicitly hoisted; no clear issue found.

### Content-visibility for offscreen content — [`rendering-content-visibility.md`](agent-skills/skills/react-best-practices/rules/rendering-content-visibility.md:1)
**Status: Unknown (needs confirmation)**
- Not yet audited for use of `content-visibility: auto` on long pages.

### Avoid hydration flicker — [`rendering-hydration-no-flicker.md`](agent-skills/skills/react-best-practices/rules/rendering-hydration-no-flicker.md:1)
**Status: Pass**
- Heavy client-only pieces are explicitly `ssr:false`, reducing mismatch risk:
  - [`src/components/Index/Hero.component.tsx`](src/components/Index/Hero.component.tsx:1)

### Conditional rendering patterns — [`rendering-conditional-render.md`](agent-skills/skills/react-best-practices/rules/rendering-conditional-render.md:1)
**Status: Pass**
- Conditional rendering used for menu overlay and avoids rendering when closed:
  - [`isExpanded && <motion.div ...>`](src/components/Layout/MobileMenu.component.tsx:76)

### Activity/animation wrappers & SVG precision rules — [`rendering-activity.md`](agent-skills/skills/react-best-practices/rules/rendering-activity.md:1), [`rendering-animate-svg-wrapper.md`](agent-skills/skills/react-best-practices/rules/rendering-animate-svg-wrapper.md:1), [`rendering-svg-precision.md`](agent-skills/skills/react-best-practices/rules/rendering-svg-precision.md:1)
**Status: Unknown (needs confirmation)**
- Not yet audited.

---

## 7) JavaScript Performance (js) — Impact: LOW-MEDIUM

**Status: Unknown (needs confirmation)**
- Rules in this section (e.g., caching lookups, combining iterations) are micro-optimizations and require a sweep of hot-path utilities.
- The animation code is the most likely hot-path area; current `Matrix` code already uses stable refs and avoids React state in the main loop:
  - [`src/components/Animations/Matrix.component.tsx`](src/components/Animations/Matrix.component.tsx:33)

---

## 8) Advanced Patterns (advanced) — Impact: LOW

### Event handler refs / useLatest patterns — [`advanced-event-handler-refs.md`](agent-skills/skills/react-best-practices/rules/advanced-event-handler-refs.md:1), [`advanced-use-latest.md`](agent-skills/skills/react-best-practices/rules/advanced-use-latest.md:1)
**Status: Unknown (needs confirmation)**
- Not yet audited.

---

# Prioritized Recommendations (based on this partial scan)

1) **Harden bundle import strategy for icon libraries**
- If you keep `react-icons`, consider ensuring all imports remain subpath imports, and/or enable Next optimizePackageImports for `react-icons`.
- Evidence locations:
  - [`src/components/Index/Icons.component.tsx`](src/components/Index/Icons.component.tsx:1)
  - [`src/components/Layout/Footer.component.tsx`](src/components/Layout/Footer.component.tsx:1)

2) **Update `useMobile()` to subscribe to boolean derived state** (matchMedia)
- Aligns with “Subscribe to Derived State” and reduces resize-driven re-renders.
- Evidence:
  - [`src/hooks/useMobile.tsx`](src/hooks/useMobile.tsx:1)

3) **Complete rule-by-rule sweep for remaining Unknown items**
- Third-party scripts, content-visibility, transitions/deferred reads, JS micro-optimizations, advanced handler patterns.

---

# Implementation Plan (if you want changes in this repo)

- Update [`useMobile()`](src/hooks/useMobile.tsx:1) to use `window.matchMedia` and only update on boolean toggles.
- Consider setting `experimental.optimizePackageImports` in [`next.config.ts`](next.config.ts:1) for libraries like `react-icons` (or validate current subpath imports are sufficient).
- Run a search for sequential `await` in server components/actions and convert independent operations to `Promise.all`.
