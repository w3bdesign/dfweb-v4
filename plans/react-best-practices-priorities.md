# React Best Practices: What to do next (priorities)

This document explains **what to change**, **why it matters**, and **how to implement it** (step-by-step), based on the audit in [`plans/react-best-practices-audit.md`](plans/react-best-practices-audit.md:1).

Scope note: These priorities stay within Vercel agent-skills `react-best-practices` themes (async/bundle/server/client/rerender/rendering/js/advanced).

---

## Priority 1 (High): Fix resize-driven re-renders in `useMobile()`

### What
Refactor [`useMobile()`](src/hooks/useMobile.tsx:1) to subscribe to a **boolean** media query (`matchMedia('(max-width: 639px)')`) instead of reacting to every `resize` event.

### Why (rule alignment)
- Aligns with **Subscribe to Derived State**: [`rerender-derived-state.md`](agent-skills/skills/react-best-practices/rules/rerender-derived-state.md:1)
- Today the hook runs `setIsMobile(...)` on every resize event (dragging window, orientation changes, etc.). Even though the state is boolean, the setter is invoked many times.
- A `matchMedia` subscription fires only when the breakpoint condition flips, reducing needless React work.

### How
Implementation outline (keep the same API: returns `boolean`):

1) In [`useMobile()`](src/hooks/useMobile.tsx:1), replace the `resize` listener with `matchMedia`.
2) Initialize state from the current media query match.
3) Listen to `mediaQueryList` changes (`change` event) and update state.

Pseudo-steps (not full code yet):
- Create `const mql = window.matchMedia('(max-width: 639px)')`
- Set initial value from `mql.matches`
- Subscribe with `mql.addEventListener('change', handler)` (and fallback to `addListener` if you want older Safari support)
- Cleanup in effect return

Validation:
- Components depending on `useMobile()` (e.g. [`MatrixCursor`](src/components/Animations/MatrixCursor.component.tsx:1)) should behave identically.
- Confirm tests (if any) don’t depend on window resize semantics.

---

## Priority 2 (High): Ensure icon imports don’t regress into barrel imports

### What
Keep `react-icons` usage **subpath-imported** and consider hardening the build via `optimizePackageImports` if desired.

### Why (rule alignment)
- Aligns with **Avoid Barrel File Imports**: [`bundle-barrel-imports.md`](agent-skills/skills/react-best-practices/rules/bundle-barrel-imports.md:1)
- `react-icons` is explicitly mentioned as a commonly affected library.
- Current code is mostly good already (subpath imports), but this is a common future regression when someone writes `import { FaX } from 'react-icons/fa'` or worse `import { IconName } from 'react-icons'`.

### How
Two options (choose one):

Option A (recommended if current is already subpath): **Enforce via lint/conventions**
- Keep imports like:
  - [`src/components/Index/Icons.component.tsx`](src/components/Index/Icons.component.tsx:1) (`react-icons/fa`, `react-icons/si`)
  - [`src/components/Layout/Footer.component.tsx`](src/components/Layout/Footer.component.tsx:1) (`react-icons/bi`)
- Add an ESLint restriction (conceptually) to disallow `react-icons` root imports. (Would be a Code-mode change in [`.eslintrc.json`](.eslintrc.json:1)).

Option B: **Enable Next optimizePackageImports**
- Update [`next.config.ts`](next.config.ts:1) to include:
  - `experimental.optimizePackageImports: ['react-icons']`
- This allows more ergonomic imports while preserving bundle behavior.

Validation:
- Run a build and verify no unexpected bundle explosion.

---

## Priority 3 (Medium): Sweep for remaining async waterfalls and fix with parallelization + preloading

### What
Do a repo-wide scan for sequential `await` chains in server components/actions, and convert independent work to `Promise.all`.

### Why (rule alignment)
- Aligns with:
  - [`async-parallel.md`](agent-skills/skills/react-best-practices/rules/async-parallel.md:1)
  - [`async-dependencies.md`](agent-skills/skills/react-best-practices/rules/async-dependencies.md:1)
  - [`async-defer-await.md`](agent-skills/skills/react-best-practices/rules/async-defer-await.md:1)
- Waterfalls are called out as “#1 performance killer” in the skill.

### How
1) Search for patterns like `await` repeated in the same function in `src/app/**`.
2) Where calls are independent, convert to `Promise.all`.
3) Where a child component awaits data, consider preloading at the top of the route and wrapping the child in `Suspense`.

Known good reference already in repo:
- Parallel fetch in [`src/app/RootLayout.tsx`](src/app/RootLayout.tsx:1)
- Preload + Suspense pattern in [`src/app/prosjekter/page.tsx`](src/app/prosjekter/page.tsx:1) with [`preloadProjects()`](src/app/prosjekter/actions.ts:51)

---

## Priority 4 (Medium): Verify server/client boundary serialization stays lean

### What
Review props passed from Server Components to Client Components to ensure they’re small, serializable, and not passing unnecessary blobs.

### Why (rule alignment)
- Aligns with: [`server-serialization.md`](agent-skills/skills/react-best-practices/rules/server-serialization.md:1)
- Even if a page is fast on the server, large serialized payloads increase TTFB/TTI and can cause hydration overhead.

### How
1) Identify client components (`"use client"`) receiving large objects.
2) Prefer passing only the required primitive fields.
3) Keep server-only utilities behind `server-only` imports where applicable (already done in [`src/app/prosjekter/actions.ts`](src/app/prosjekter/actions.ts:1)).

---

## Priority 5 (Low/Targeted): Deduplicate global listeners only if they scale up

### What
If many components end up attaching the same global listener, centralize it (SWR subscription pattern).

### Why (rule alignment)
- Aligns with: [`client-event-listeners.md`](agent-skills/skills/react-best-practices/rules/client-event-listeners.md:1)
- Currently this does not look like a scaling problem, but it can become one.

### How
- Keep as-is unless a hook is used N times per page.
- If it becomes common, implement a shared subscription and fan-out callbacks.

---

## Suggested execution order (no estimates)

1) Implement `useMobile()` matchMedia refactor ([`useMobile.tsx`](src/hooks/useMobile.tsx:1))
2) Decide icon strategy: ESLint restriction vs Next optimizePackageImports ([`.eslintrc.json`](.eslintrc.json:1) or [`next.config.ts`](next.config.ts:1))
3) Run async waterfall sweep in `src/app/**`
4) Review server→client serialization boundaries

---

## Approval gate

Once you’re happy with these priorities, I’ll switch to Code mode and implement the selected items.
