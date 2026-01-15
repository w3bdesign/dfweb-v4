# dfweb-v4: What we need to change vs what we should change (agent-skills React best practices)

This is a **repo-specific** action list based on scanning `dfweb-v4` against the rules in [`agent-skills/skills/react-best-practices/rules/`](agent-skills/skills/react-best-practices/rules/_sections.md:1).

Definitions used here:
- **Need to change**: There is a clear mismatch with a CRITICAL/HIGH-impact rule **and** a concrete location in this repo where we can fix it now.
- **Should change**: Improvement that aligns with the rules but is either (a) medium/low impact, (b) situational, or (c) requires more confirmation/measurement.

Also: some rules require a “sweep” across the repo to be confident we didn’t miss anything. Those are explicitly called out.

---

## Need to change

### 1) Avoid resize-driven updates in `useMobile()` (derived boolean subscription)
**Rule:** Subscribe to Derived State — [`rerender-derived-state.md`](agent-skills/skills/react-best-practices/rules/rerender-derived-state.md:1)

**Why this is a “need”**
- This is a direct, concrete fit for the rule.
- It’s in a reusable hook and can affect any component that uses it.

**Where**
- [`useMobile()`](src/hooks/useMobile.tsx:1) currently:
  - Registers `window.addEventListener('resize', checkIfMobile)`
  - Calls `setIsMobile(window.innerWidth < 640)` on every resize event

**How (approach)**
- Replace resize subscription with `matchMedia('(max-width: 639px)')`
- Update state only when the media query match flips.

---

### 2) Complete the CRITICAL async-waterfall sweep (ensure no sequential awaits in server components)
**Rules:**
- Promise.all for Independent Operations — [`async-parallel.md`](agent-skills/skills/react-best-practices/rules/async-parallel.md:1)
- Defer await / avoid dependency waterfalls — [`async-defer-await.md`](agent-skills/skills/react-best-practices/rules/async-defer-await.md:1), [`async-dependencies.md`](agent-skills/skills/react-best-practices/rules/async-dependencies.md:1)

**Why this is a “need”**
- The rule category is CRITICAL, and we have multiple server components that `await client.fetch(...)`.
- We already have at least one good example (so the team is willing to do it):
  - [`Promise.all([...])`](src/app/RootLayout.tsx:15)

**Where to check (known async entry points)**
- [`src/app/page.tsx`](src/app/page.tsx:1) (server component; does `await client.fetch(pageContentQuery)`)
- [`src/app/cv/page.tsx`](src/app/cv/page.tsx:1) (server component; does `await client.fetch(cvQuery)`)
- [`src/app/RootLayout.tsx`](src/app/RootLayout.tsx:1) (already uses `Promise.all`)
- [`src/app/prosjekter/page.tsx`](src/app/prosjekter/page.tsx:1) + [`src/app/prosjekter/actions.ts`](src/app/prosjekter/actions.ts:1)
- API routes:
  - [`src/app/api/form/route.ts`](src/app/api/form/route.ts:1)
  - [`src/app/api/siteMapGenerator.ts`](src/app/api/siteMapGenerator.ts:1)

**How (approach)**
- Run a focused review of each server component and route:
  - If multiple independent async operations exist, convert to `Promise.all`.
  - If a page awaits data that could be preloaded, use the existing preload pattern:
    - [`preloadProjects()`](src/app/prosjekter/actions.ts:51) + Suspense boundary in [`src/app/prosjekter/page.tsx`](src/app/prosjekter/page.tsx:41)

Note: the repo already does some of this well; the “need” is to ensure we don’t miss other waterfall opportunities.

---

## Should change

### 3) Harden bundle-import strategy for `react-icons`
**Rule:** Avoid Barrel File Imports — [`bundle-barrel-imports.md`](agent-skills/skills/react-best-practices/rules/bundle-barrel-imports.md:1)

**Why this is a “should” (not an urgent need)**
- Current imports are already mostly in a safer form (subpath imports):
  - [`src/components/Index/Icons.component.tsx`](src/components/Index/Icons.component.tsx:1)
  - [`src/components/Layout/Footer.component.tsx`](src/components/Layout/Footer.component.tsx:1)
- But this is a common future regression; hardening prevents performance regressions.

**Options**
- Add `experimental.optimizePackageImports: ['react-icons']` in [`next.config.ts`](next.config.ts:1)
- Or enforce a convention via ESLint restrictions in [`.eslintrc.json`](.eslintrc.json:1)

---

### 4) Verify we don’t over-serialize large objects into client components
**Rule:** Minimize serialization across server/client boundary — [`server-serialization.md`](agent-skills/skills/react-best-practices/rules/server-serialization.md:1)

**Why this is a “should”**
- We already use `server-only` where it matters:
  - [`src/app/prosjekter/actions.ts`](src/app/prosjekter/actions.ts:2)
- But serialization issues are easy to introduce in RSC apps; a quick review is defensive.

**Where to look first**
- Client components receiving rich Sanity objects:
  - Any `"use client"` component in [`src/components/`](src/components/UI/Button.component.tsx:1) that receives `pageContent`/`cvData`-like data.

---

### 5) Deduplicate global listeners if they scale beyond single-use
**Rule:** Deduplicate Global Event Listeners — [`client-event-listeners.md`](agent-skills/skills/react-best-practices/rules/client-event-listeners.md:1)

**Why this is a “should”**
- We do attach listeners in several places:
  - [`useMobile()` resize listener](src/hooks/useMobile.tsx:12)
  - [`Matrix` resize listener](src/components/Animations/Matrix.component.tsx:119)
  - [`MatrixCursor` attaches listeners to hero section](src/components/Animations/MatrixCursor.component.tsx:61)
- But these don’t look like “N instances per page” today.

---

### 6) Confirm we’re using dynamic imports for heavy/optional parts consistently
**Rule:** Dynamic Imports for Heavy Components — [`bundle-dynamic-imports.md`](agent-skills/skills/react-best-practices/rules/bundle-dynamic-imports.md:1)

**Current status**
- Good examples exist:
  - [`src/app/page.tsx`](src/app/page.tsx:1)
  - [`src/components/Index/Hero.component.tsx`](src/components/Index/Hero.component.tsx:1)

**What to verify**
- Any other heavy animation/visual components should follow this pattern.

---

## “Don’t miss anything” checklist (sweeps we should do before implementing)

To ensure completeness against the agent-skills rule set, these are the remaining sweeps to run:

1) **Async waterfalls sweep**
- Inspect all server components and API routes in `src/app/**` for sequential awaits.

2) **Third-party script deferment sweep**
- Check for analytics or heavy scripts; rule is [`bundle-defer-third-party.md`](agent-skills/skills/react-best-practices/rules/bundle-defer-third-party.md:1).

3) **Transitions/deferred reads sweep**
- Search for `useTransition`, `startTransition`, `useDeferredValue`; rule files:
  - [`rerender-transitions.md`](agent-skills/skills/react-best-practices/rules/rerender-transitions.md:1)
  - [`rerender-defer-reads.md`](agent-skills/skills/react-best-practices/rules/rerender-defer-reads.md:1)

4) **Rendering-performance sweep**
- Long pages/components for `content-visibility` opportunities:
  - [`rendering-content-visibility.md`](agent-skills/skills/react-best-practices/rules/rendering-content-visibility.md:1)

5) **JS micro-optimizations sweep (only in hot paths)**
- Focus on animation utilities and tight loops:
  - [`src/components/Animations/Matrix.renderer.ts`](src/components/Animations/Matrix.renderer.ts:1)
  - [`src/components/Animations/Matrix.utils.ts`](src/components/Animations/Matrix.utils.ts:1)

---

## Proposed priority order

1) **Need:** refactor [`useMobile()`](src/hooks/useMobile.tsx:1) to `matchMedia`
2) **Need:** complete async-waterfall review and apply `Promise.all`/preload patterns
3) **Should:** harden `react-icons` imports (Next optimizePackageImports or ESLint rule)
4) **Should:** review server→client serialization boundaries

---

## Approval gate

Once you pick which “Need” and “Should” items to implement, I’ll switch to Code mode and apply the changes.
