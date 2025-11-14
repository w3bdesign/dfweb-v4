# React Improvements - Lessons from 10 Years of React Development

Based on analysis of the codebase and insights from Corey House's "Lessons from 10 Years of React Development" talk.

---

## Executive Summary

**Priority Recommendations (in order):**

1. ✅ **HIGH PRIORITY**: Add Zod runtime validation for Sanity data
2. ✅ **MEDIUM PRIORITY**: Refactor error boundary placement in RootLayout
3. ℹ️ **LOW PRIORITY**: Consider URL-based state for future features
4. 📋 **FUTURE**: Keep TanStack Query + useErrorBoundary pattern in mind for client-heavy features

---

## 1. Runtime Validation with Zod for Sanity Data

### Current State
- ✅ Already using Zod for contact form validation (`zodResolver(formSchema)`)
- ❌ No runtime validation for Sanity CMS responses
- ⚠️ Relying solely on TypeScript types (which don't exist at runtime)

### Recommendation
Add Zod schemas to validate Sanity API responses, starting with the `Project` type.

### Implementation Difficulty
**🟢 EASY** - Estimated time: 30-60 minutes

### Pros
- ✅ **Fail fast**: Catch schema mismatches immediately instead of weird runtime bugs
- ✅ **Better error messages**: Know exactly what field is wrong and why
- ✅ **Production safety**: If Sanity content or schema drifts, you get explicit errors
- ✅ **Existing pattern**: Already using Zod in the codebase
- ✅ **Works with current error boundaries**: Validation errors bubble to existing error handling
- ✅ **Type safety**: Zod can infer TypeScript types, keeping types and validation in sync

### Cons
- ⚠️ **Slight performance overhead**: Validation runs on every fetch (minimal impact)
- ⚠️ **Maintenance**: Need to keep Zod schemas in sync with Sanity schema
- ⚠️ **Initial setup**: Requires defining schemas for all Sanity types you use

### Code Example

```typescript
// src/lib/sanity/schemas.ts
import { z } from "zod";

export const ProjectSchema = z.object({
  _id: z.string(),
  _type: z.literal("project"),
  id: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  subdescription: z.string().optional(),
  urlwww: z.array(z.object({
    title: z.string().optional(),
    url: z.string().optional(),
    external: z.boolean().optional(),
    _key: z.string(),
  })).optional(),
  urlgithub: z.array(z.object({
    title: z.string().optional(),
    url: z.string().optional(),
    external: z.boolean().optional(),
    _key: z.string(),
  })).optional(),
  projectimage: z.object({
    asset: z.object({
      _ref: z.string(),
      _type: z.literal("reference"),
    }).optional(),
  }).optional(),
  featured: z.boolean().optional(),
  featureOrder: z.number().optional(),
});

export const ProjectsSchema = z.array(ProjectSchema);

// Infer TypeScript type from Zod schema
export type ValidatedProject = z.infer<typeof ProjectSchema>;
```

```typescript
// src/app/prosjekter/actions.ts
import { ProjectsSchema } from "@/lib/sanity/schemas";

async function fetchProjectsFromSanity(): Promise<Project[]> {
  const rawData = await client.fetch(
    projectsQuery,
    {},
    {
      next: { revalidate: 3600 },
    },
  );
  
  // Validate runtime data - throws if invalid
  const validatedData = ProjectsSchema.parse(rawData);
  
  return validatedData;
}
```

### Why This Matters
From the talk: *"TypeScript does not exist at runtime. If I want to make sure that some runtime data meets my types, TypeScript cannot help me."*

When Sanity returns unexpected data (schema changes, content issues, API problems), you want to know immediately with a clear error message, not discover it when a user reports a broken page.

---

## 2. Granular Error Boundary Placement

### Current State
```tsx
// src/app/RootLayout.tsx
return (
  <ErrorBoundary>
    <div className="flex flex-col grow">
      <Header navigation={navigation} />
      <SpeedInsights />
      <div className="grow">{children}</div>
      <Footer footerCopyrightText={...} />
    </div>
  </ErrorBoundary>
);
```

**Problem**: If anything throws (including Header or Footer), the entire app shell disappears (white screen).

### Recommendation
Move the error boundary to wrap only the page content, keeping navigation and footer visible.

### Implementation Difficulty
**🟢 EASY** - Estimated time: 10-15 minutes

### Pros
- ✅ **Better UX**: Users can still navigate even if a page crashes
- ✅ **Debugging**: Easier to identify which part failed
- ✅ **Resilience**: Critical UI (nav/footer) remains functional
- ✅ **Minimal code change**: Just moving the boundary wrapper
- ✅ **Aligns with best practices**: Matches the talk's "granular error boundaries" recommendation

### Cons
- ⚠️ **Slightly more complex**: Need to think about boundary placement
- ⚠️ **Header/Footer errors**: If these components fail, they'll crash the whole app (but they're simpler/less likely to fail)

### Code Example

```tsx
// src/app/RootLayout.tsx
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navigation, { footerCopyrightText }] = await Promise.all([
    client.fetch(navigationQuery),
    client.fetch(settingsQuery),
  ]);

  return (
    <div className="flex flex-col grow">
      <Header navigation={navigation} />
      <SpeedInsights />
      
      {/* Error boundary only around page content */}
      <ErrorBoundary>
        <div className="grow">{children}</div>
      </ErrorBoundary>
      
      <Footer
        footerCopyrightText={
          footerCopyrightText ?? "Copyright Daniel Fjeldstad"
        }
      />
    </div>
  );
}
```

### Why This Matters
From the talk: *"I very rarely see people putting error boundaries at granular levels. It's really useful to have an error boundary around every one of your pages... I would really like to still be able to see the navigation, the footer."*

Real example from the talk: A client had a production outage because a third-party weather API went down and they didn't have an error boundary around it - the whole app went white.

---

## 3. URL-Based State Management

### Current State
- ✅ Good: Using Next.js routing for pages
- ℹ️ Opportunity: No filtering/sorting/pagination on `/prosjekter` yet

### Recommendation
When adding features like project filtering, sorting, or search, use URL query parameters instead of local React state.

### Implementation Difficulty
**🟡 MEDIUM** - Only relevant when adding new features

### Pros
- ✅ **Shareable**: Users can share filtered/sorted views via URL
- ✅ **Back button works**: Browser history navigation works as expected
- ✅ **Bookmarkable**: Users can bookmark specific views
- ✅ **SEO friendly**: Search engines can index different views
- ✅ **Deep linking**: Direct links to specific states

### Cons
- ⚠️ **More complex**: Requires URL parsing and state synchronization
- ⚠️ **Not always needed**: Overkill for truly ephemeral UI state (modals, tooltips)

### Code Example (Future Reference)

```tsx
// Example: Project filtering with URL state
"use client";

import { useSearchParams, useRouter } from 'next/navigation';

export default function ProjectsPage({ projects }: { projects: Project[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'name';
  
  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', newCategory);
    router.push(`/prosjekter?${params.toString()}`);
  };
  
  const filteredProjects = projects.filter(p => 
    category === 'all' || p.projectcategory === category
  );
  
  return (
    <div>
      <select value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
        <option value="all">All Categories</option>
        {/* ... */}
      </select>
      {/* Render filtered projects */}
    </div>
  );
}
```

### Why This Matters
From the talk: *"URL state is at the top of this flowchart for a reason - people underutilize URLs and should start there."*

---

## 4. TanStack Query + useErrorBoundary (Future Consideration)

### Current State
- ✅ Server-side data fetching with Next.js
- ✅ Using `react-error-boundary` for error handling
- ❌ Not using TanStack Query (React Query)

### Recommendation
**Keep this pattern in mind** for future client-heavy features, but don't retrofit it now.

### Implementation Difficulty
**🔴 COMPLEX** - Would require architectural changes

### When to Consider
- Adding real-time features (live updates, collaboration)
- Heavy client-side data fetching (search, filters, infinite scroll)
- Need for optimistic UI updates
- Complex caching requirements

### Pros
- ✅ **Automatic caching**: Reduces unnecessary API calls
- ✅ **Background refetching**: Keeps data fresh automatically
- ✅ **Optimistic updates**: Instant UI feedback
- ✅ **Error handling**: `throwOnError` integrates with error boundaries
- ✅ **Loading states**: Built-in loading/error/success states
- ✅ **Retry logic**: Automatic retries on failure

### Cons
- ⚠️ **Learning curve**: New API to learn
- ⚠️ **Bundle size**: Adds ~13kb to client bundle
- ⚠️ **Complexity**: Overkill for simple server-rendered apps
- ⚠️ **Not needed now**: Current server-side approach works well

### Why Not Now?
Your app is primarily server-rendered with minimal client-side data fetching. The current approach is simpler and more appropriate. TanStack Query shines when you have lots of client-side data operations.

From the talk: *"In my experience, 90-something percent of the data in your application is fetched from a server. When you get remote state management right, most of your application falls into place."*

---

## 5. Current State Assessment

### What You're Already Doing Well ✅

1. **Error Boundaries**
   - ✅ Root-level error boundary with custom Matrix fallback
   - ✅ Route-level error handling for `/prosjekter`
   - ✅ Using `react-error-boundary` library

2. **Form Validation**
   - ✅ Using Zod with `react-hook-form` for contact form
   - ✅ Proper error display and accessibility

3. **State Management**
   - ✅ Keeping state local and low in component tree
   - ✅ Using `useState` appropriately
   - ✅ Not over-engineering with unnecessary global state

4. **TypeScript**
   - ✅ Strong typing throughout
   - ✅ Generated types from Sanity schema

### What Could Be Improved 🔧

1. **Runtime Validation** (HIGH PRIORITY)
   - Add Zod validation for Sanity responses

2. **Error Boundary Granularity** (MEDIUM PRIORITY)
   - Adjust placement to preserve nav/footer on page errors

3. **Future Features** (LOW PRIORITY)
   - Remember URL-based state for filters/search
   - Consider TanStack Query if adding heavy client features

---

## Implementation Priority

### Phase 1: Quick Wins (1-2 hours)
1. ✅ Add Zod validation for `Project` type
2. ✅ Refactor RootLayout error boundary placement
3. ✅ Test error scenarios to verify improvements

### Phase 2: Future Features (As Needed)
1. ℹ️ Use URL state when adding project filters/search
2. ℹ️ Evaluate TanStack Query if adding real-time features

### Phase 3: Advanced (Optional)
1. 📋 Add more granular error boundaries around complex widgets
2. 📋 Implement error monitoring/logging service integration
3. 📋 Add Zod validation for other Sanity types (Navigation, Page, CV)

---

## Patterns to Avoid

Based on the talk, here are patterns to avoid:

❌ **Don't use Redux** - Zustand is simpler for the same use cases
❌ **Don't overuse Context** - Performance issues with frequently changing data
❌ **Don't ignore error boundaries** - Most React apps have inadequate error handling
❌ **Don't skip runtime validation** - TypeScript doesn't exist at runtime
❌ **Don't lift state too early** - Keep it local until you need to share it
❌ **Don't create derived state** - Calculate values during render instead

---

## Resources

- [React Error Boundary Docs](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [react-error-boundary Library](https://github.com/bvaughn/react-error-boundary)
- [Zod Documentation](https://zod.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Corey House's Pluralsight Courses](https://www.pluralsight.com/authors/cory-house)

---

## Conclusion

Your codebase is already following many best practices from the talk. The two highest-impact improvements are:

1. **Add Zod runtime validation** - Protects against unexpected API responses
2. **Refactor error boundary placement** - Better UX when errors occur

Both are easy to implement and provide immediate value. The other recommendations are good to keep in mind for future features but aren't urgent for the current application.
