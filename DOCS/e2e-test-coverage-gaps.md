# E2E Test Coverage Gap Analysis

**Generated:** 2026-07-04  
**Method:** Playwright CLI systematic exploration  
**Tool:** `npx playwright-cli` snapshot and navigation commands

---

## Executive Summary

This document identifies gaps in end-to-end test coverage by comparing actual application structure (discovered via playwright-cli) with existing Playwright tests in `src/e2e/playwright/`.

**Key Findings:**
- ✅ Core content visibility is well-tested
- ✅ CV page keyboard navigation is comprehensive
- ❌ **Critical Gap:** Mobile navigation completely untested
- ❌ **Critical Gap:** Form functionality (validation, submission) untested
- ❌ **Critical Gap:** Navigation features (skip link, external links) untested
- ⚠️ **Console Issues:** AnimatePresence warnings, image configuration warnings

---

## Pages Analyzed

### 1. Homepage (`/`)

#### Current Structure (Discovered)
```yaml
Navigation:
  - Skip link: "Hopp til hovedinnhold"
  - Menu items: Hjem, Prosjekter, CV, Github (external), Kontakt
  - Mobile: Hamburger menu ("Åpne meny")

Hero Section:
  - H1: "Hei!"
  - H2: "Jeg heter Daniel Fjeldstad og er en webutvikler."
  - Paragraph: Skills description
  - Icons: React, VueJS, TypeScript, WordPress, PHP

Content Sections:
  - "Om Meg" region with content and "Utløs Testfeil" button
  - "Prosjekter" region with content and "Utløs Testfeil" button
  - Links: GitHub (2x), Prosjekter page link

Footer:
  - Copyright text: "Copyright Daniel Fjeldstad"
  - Logo image
  - Year: "2026"
```

#### ✅ Existing Test Coverage
- Main heading "Hei!" visibility
- Subheading visibility and text content
- Skills text visibility
- Icons section visibility
- "Om Meg" section title and content
- "Prosjekter" section content

#### ❌ Missing Test Coverage
1. **Skip Link**
   - Not tested: Skip link functionality (#main-content anchor)
   - Not tested: Keyboard navigation to skip link
   - Not tested: Skip link actually focuses main content

2. **Navigation**
   - Not tested: All navigation links (Hjem, Prosjekter, CV, Kontakt)
   - Not tested: External GitHub link navigation
   - Not tested: Active/current page indication
   - Not tested: Logo/branding presence

3. **Error Boundary Buttons**
   - Not tested: "Utløs Testfeil" buttons in both sections
   - Not tested: Error boundary activation
   - Not tested: Error recovery

4. **In-Content Links**
   - Not tested: GitHub links within "Prosjekter" section
   - Not tested: Prosjekter page link within content

5. **Technology Icons**
   - Not tested: Individual icon visibility (React, Vue, TypeScript, etc.)
   - Not tested: Icon alt text/accessibility

6. **Footer**
   - Not tested: Footer visibility
   - Not tested: Copyright text
   - Not tested: Footer logo
   - Not tested: Year display

---

### 2. CV Page (`/cv`)

#### Current Structure (Discovered)
```yaml
Main Content:
  - Tab interface (vertical orientation)
  - Tabs: Nøkkelkvalifikasjoner, Erfaring, Utdanning, Frivillig arbeid
  - "Last ned PDF" button/link
  - PDF images/viewer (visible in snapshot)

Console Warnings:
  - AnimatePresence mode="wait" with multiple children (2x)
```

#### ✅ Existing Test Coverage
- Tabs visibility (Nøkkelkvalifikasjoner)
- Tab navigation to Erfaring section
- Erfaring section content ("– 2021 - NovaCare")
- Utdanning section content
- Comprehensive keyboard navigation (ArrowUp/Down, Home, End, wrapping)
- ARIA attributes (aria-orientation, tabindex, aria-selected)

#### ❌ Missing Test Coverage
1. **Tab Content**
   - Not tested: Nøkkelkvalifikasjoner tab content (default tab)
   - Not tested: Frivillig arbeid tab content
   - Not tested: Content actually changes when tabs are clicked

2. **PDF Functionality**
   - Not tested: "Last ned PDF" button/link exists
   - Not tested: PDF download functionality
   - Not tested: PDF viewer/images display

3. **Tab Panel ARIA**
   - Not tested: Tab panels have correct aria-labelledby
   - Not tested: Hidden tab panels have aria-hidden="true"

4. **Animation Issues**
   - Not tested: AnimatePresence warning not captured
   - Could add regression test to prevent warning

---

### 3. Kontakt Page (`/kontakt`)

#### Current Structure (Discovered)
```yaml
Form Elements:
  - "Fullt navn" field
  - "Telefonnummer" field
  - "Hva ønsker du å si?" field (textarea)
  - "Send skjema" submit button

Snapshot Note:
  - Main area shows minimal content (likely form is loaded dynamically)
```

#### ✅ Existing Test Coverage
- Form labels visibility (Fullt navn, Telefonnummer, Hva ønsker du å si?)
- Submit button visibility
- Submit button text ("Send skjema")

#### ❌ Missing Test Coverage
1. **Form Functionality**
   - Not tested: Form submission
   - Not tested: Form validation (required fields)
   - Not tested: Email field validation
   - Not tested: Phone number validation
   - Not tested: Success message after submission
   - Not tested: Error messages for invalid input

2. **Form Fields**
   - Not tested: Input field interactivity (typing, clearing)
   - Not tested: Field focus states
   - Not tested: Label-input associations (for attribute)
   - Not tested: Placeholder text

3. **Accessibility**
   - Not tested: Required field indicators
   - Not tested: Error message announcements (aria-live)
   - Not tested: Form field error states (aria-invalid)

4. **Form Behavior**
   - Not tested: Form reset after successful submission
   - Not tested: Submit button disabled state during submission
   - Not tested: Loading/pending states

---

### 4. Prosjekter Page (`/prosjekter`)

#### Current Structure (Discovered)
```yaml
Main Content:
  - H1: "Prosjekter"
  - Main area: "Innhold portefølje" labeled region
  - Images displayed in main area

Project Cards (from text):
  - Multiple "Besøk" and "GitHub" links
  - Project titles and descriptions

Console Warnings:
  - Image quality="100" not configured (7 images)
  - Image width/height aspect ratio warnings (4 images)
  - LCP image loading="eager" recommendation (2 images)
```

#### ✅ Existing Test Coverage
- Main heading "Prosjekter" visibility
- "Dfweb versjon" project heading visibility
- Project images (Earth Doom, NextJS WooCommerce)
- Portfolio content contains "Earth Doom"
- Technologies text visibility
- "Besøk" and "GitHub" links visibility (first project)

#### ❌ Missing Test Coverage
1. **Project Card Interactions**
   - Not tested: Clicking "Besøk" link navigates correctly
   - Not tested: Clicking "GitHub" link opens external site
   - Not tested: All project cards present (only first tested)
   - Not tested: Project card structure consistency

2. **Project Details**
   - Not tested: All project titles present
   - Not tested: All project descriptions present
   - Not tested: All technology pills present
   - Not tested: Project images have correct alt text

3. **Image Performance**
   - Not tested: Images load without console warnings
   - Not tested: LCP optimization (loading="eager" on above-fold images)
   - Not tested: Image aspect ratios maintained

4. **Filtering/Categorization**
   - Unknown: If categories exist, not tested
   - Unknown: If filtering exists, not tested

---

## Cross-Page Issues

### 1. Mobile Navigation (CRITICAL GAP)

**Discovered Structure:**
```yaml
Mobile (375x667):
  - Navigation shows: "Åpne meny" button
  - Hamburger icon visible
  - Full menu hidden until activated
```

#### ❌ Completely Untested
- Mobile menu button ("Åpne meny") presence
- Hamburger menu opening/closing
- Mobile menu navigation items
- Mobile menu accessibility (focus trap, Escape key)
- Mobile menu ARIA attributes (aria-expanded, aria-label)
- Mobile menu overlay/backdrop
- Transition from desktop to mobile navigation at breakpoint

**Recommendation:** Add dedicated mobile navigation test suite

---

### 2. Skip Link (Accessibility)

**Found on all pages:**
```yaml
- link "Hopp til hovedinnhold" [ref=e3]:
  - /url: "#main-content"
```

#### ❌ Not Tested
- Skip link exists on all pages
- Skip link is first focusable element
- Skip link jumps to main content on activation
- Skip link has proper aria-label
- Skip link visible on keyboard focus

**Recommendation:** Add accessibility test for skip link

---

### 3. Page Transitions

#### ❌ Not Tested
- Navigation between pages works
- Page title updates correctly
- URL changes correctly
- Back/forward browser navigation
- Page transition animations complete

**Recommendation:** Add navigation flow tests

---

### 4. Error Handling

#### ❌ Not Tested
- 404 page (not-found.tsx)
- Error boundary activation ("Utløs Testfeil" buttons)
- Error recovery
- Error fallback component display
- Network error handling

**Recommendation:** Add error scenario tests

---

### 5. Loading States

#### ❌ Not Tested
- Page loading states (loading.tsx)
- Skeleton loaders
- Content loading indicators
- Suspense boundaries

**Recommendation:** Add loading state tests

---

## Console Warnings Found

### CV Page
```
WARNING: You're attempting to animate multiple children within AnimatePresence, 
but its mode is set to "wait". This will lead to odd visual behaviour.
```

**Impact:** Potential animation bugs on CV page tab switching  
**Recommendation:** Fix AnimatePresence configuration or add test to prevent regression

---

### Prosjekter Page
```
WARNING: Image with src "https://cdn.sanity.io/images/..." is using quality "100" 
which is not configured in images.qualities [75].
```

**Impact:** 7 images with misconfigured quality  
**Recommendation:** Add quality="100" to next.config.ts images.qualities or change quality

```
WARNING: Image was detected as the Largest Contentful Paint (LCP). 
Please add the `loading="eager"` property if this image is above the fold.
```

**Impact:** Poor LCP performance  
**Recommendation:** Add loading="eager" to first 2 project images

---

## Priority Test Additions

### P0 - Critical (Must Have)
1. **Mobile Navigation Suite**
   - Test hamburger menu open/close
   - Test mobile menu navigation
   - Test menu accessibility (focus trap, keyboard)

2. **Form Functionality (Kontakt)**
   - Test form submission
   - Test form validation
   - Test error messages
   - Test success states

3. **Skip Link (All Pages)**
   - Test skip link presence
   - Test skip link navigation
   - Test keyboard accessibility

### P1 - High Priority (Should Have)
4. **CV Tab Content**
   - Test all tab panels display correct content
   - Test Nøkkelkvalifikasjoner content
   - Test Frivillig arbeid content

5. **Navigation Links**
   - Test all internal navigation works
   - Test external GitHub link
   - Test footer links

6. **Error Boundaries**
   - Test "Utløs Testfeil" buttons trigger error boundary
   - Test error recovery

### P2 - Medium Priority (Nice to Have)
7. **Project Cards**
   - Test all project cards present
   - Test all project links work
   - Test project image alt text

8. **Page Transitions**
   - Test navigation between all pages
   - Test page title updates
   - Test URL changes

9. **Footer Testing**
   - Test footer on all pages
   - Test copyright text
   - Test footer logo

### P3 - Low Priority (Future)
10. **Loading States**
    - Test skeleton loaders
    - Test suspense boundaries

11. **Performance**
    - Test LCP times
    - Test image loading

12. **SEO**
    - Test meta tags
    - Test structured data

---

## Recommended Test Files to Create

### New Test Files Needed

1. **`src/e2e/playwright/navigation.spec.ts`**
   ```typescript
   // Test header navigation, skip link, mobile menu
   ```

2. **`src/e2e/playwright/footer.spec.ts`**
   ```typescript
   // Test footer on all pages
   ```

3. **`src/e2e/playwright/mobile.spec.ts`**
   ```typescript
   // Test mobile-specific functionality
   ```

4. **`src/e2e/playwright/accessibility.spec.ts`**
   ```typescript
   // Test skip links, ARIA landmarks, keyboard navigation
   ```

5. **`src/e2e/playwright/error-handling.spec.ts`**
   ```typescript
   // Test error boundaries, 404 page
   ```

6. **`src/e2e/playwright/forms.spec.ts`**
   ```typescript
   // Enhanced form testing (validation, submission)
   ```

---

## Existing Test Enhancements

### `src/e2e/playwright/cv.spec.ts` Enhancements
- Add test for Nøkkelkvalifikasjoner tab content
- Add test for Frivillig arbeid tab content
- Add test for PDF download button
- Add test for tab panel content changes

### `src/e2e/playwright/kontakt.spec.ts` Enhancements
- Add form validation tests
- Add form submission test
- Add error message tests
- Add success state test

### `src/e2e/playwright/prosjekter.spec.ts` Enhancements
- Add tests for all project cards
- Add tests for link navigation
- Add tests for image alt text
- Add tests for technology pills

### `src/e2e/playwright/index.spec.ts` Enhancements
- Add tests for error boundary buttons
- Add tests for in-content links
- Add tests for individual technology icons
- Add tests for footer

---

## Technical Debt & Warnings

### Image Configuration (next.config.ts)
```typescript
// Current: images.qualities = [75]
// Needed: images.qualities = [100, 75]
```

### AnimatePresence Issue (CV Page)
```typescript
// Current: <AnimatePresence mode="wait">
// Problem: Multiple children with mode="wait"
// Solution: Remove mode="wait" or ensure single child
```

### LCP Images (Prosjekter Page)
```typescript
// Add to first 2 project images:
// loading="eager"
```

---

## Conclusion

**Overall Coverage Assessment:**
- Content Visibility: ✅ **Good** (80%+ coverage)
- User Interactions: ⚠️ **Moderate** (40% coverage)
- Accessibility: ⚠️ **Moderate** (50% coverage)
- Mobile: ❌ **Poor** (0% coverage)
- Error Handling: ❌ **Poor** (0% coverage)
- Forms: ❌ **Poor** (20% coverage)

**Total Estimated Gaps:** ~35 missing test scenarios

**Next Steps:**
1. Create mobile navigation test suite (P0)
2. Enhance form testing (P0)
3. Add skip link tests (P0)
4. Fix console warnings (technical debt)
5. Add comprehensive navigation tests (P1)
6. Implement error boundary tests (P1)

---

## Appendix: Playwright CLI Commands Used

```bash
# Homepage exploration
npx playwright-cli goto http://localhost:3000
npx playwright-cli snapshot

# CV page exploration
npx playwright-cli goto http://localhost:3000/cv
npx playwright-cli snapshot

# Kontakt page exploration
npx playwright-cli goto http://localhost:3000/kontakt
npx playwright-cli snapshot

# Prosjekter page exploration
npx playwright-cli goto http://localhost:3000/prosjekter
npx playwright-cli snapshot

# Mobile viewport testing
npx playwright-cli goto http://localhost:3000
npx playwright-cli resize 375 667
npx playwright-cli snapshot

# Console/network analysis
# Logs automatically captured in .playwright-cli/console-*.log files
```

**Artifacts Generated:**
- 6 page snapshots (.yml files)
- 6 console logs (.log files)
- Stored in: `.playwright-cli/`
