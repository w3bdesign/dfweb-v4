# Implementation Plan

[Overview]
Introduce Zod-based runtime validation for all Sanity CMS responses, starting with the `Project` type, by adding a dedicated validation layer that is easy to reuse, extend, and keep in sync with Sanity schemas.

This implementation will add Zod schemas that mirror the Sanity content models and GROQ query projections, then integrate them at the data-fetching boundary (server actions and layout loaders) so invalid content fails fast in a controlled, observable way. The plan emphasizes a clear folder structure (`src/lib/sanity`) and shared helpers to minimize duplication and make it straightforward to add validation for new content types over time. We will default to **fail-fast behavior** (throwing on invalid data so error boundaries handle UI failures) while providing patterns for optional graceful degradation where appropriate.

[Types]
Define a Zod-backed type layer for Sanity documents, using Zod inference as the single source of truth wherever feasible.

Detailed type definitions and structures:

1. **Core Zod Schemas (Sanity shapes)**  
   New file: `src/lib/sanity/schemas.ts`

   These schemas will closely mirror the existing generated types in `src/types/sanity.types.ts` but will be **manually curated** for fields actually used by the app. This keeps validation focused and easier to maintain.

   - `LinkSchema`
     ```ts
     const LinkSchema = z.object({
       title: z.string().optional(),
       url: z.string().url().optional(),
       external: z.boolean().optional(),
       _key: z.string().optional(),
     });
     ```

   - `ImageReferenceSchema` (for `projectimage` and similar)
     ```ts
     const ImageReferenceSchema = z.object({
       asset: z
         .object({
           _ref: z.string(),
           _type: z.literal("reference"),
         })
         .optional(),
     });
     ```

   - `ProjectSchema`
     ```ts
     export const ProjectSchema = z.object({
       _id: z.string(),
       _type: z.literal("project"),
       id: z.number().optional(),
       name: z.string().optional(),
       description: z.string().optional(),
       subdescription: z.string().optional(),
       projectcategory: z
         .object({
           _id: z.string().optional(),
           title: z.string().optional(),
         })
         .optional(),
       urlwww: z.array(LinkSchema).optional(),
       urlgithub: z.array(LinkSchema).optional(),
       projectimage: ImageReferenceSchema.optional(),
       featured: z.boolean().optional(),
       featureOrder: z.number().optional(),
     });

     export const ProjectsSchema = z.array(ProjectSchema);
     ```

   - Future schemas (planned but not required in the first implementation slice):
     - `NavigationSchema` (for `navigationQuery` response)
     - `SettingsSchema` (for `settingsQuery`)
     - `PageSchema` (for `pageContentQuery`)
     - `CvSchema` (for `cvQuery`)

2. **Inferred Types from Zod**  
   We will use Zod's inference to define runtime-aligned TypeScript types for validated data:

   ```ts
   export type ValidatedProject = z.infer<typeof ProjectSchema>;
   export type ValidatedProjects = z.infer<typeof ProjectsSchema>;
   ```

   For the initial implementation, we will:
   - Prefer using `ValidatedProject` / `ValidatedProjects` as return types from validation-aware fetch functions.
   - Where existing code expects `Project[]` from `src/types/sanity.types.ts`, we will confirm structural compatibility and either:
     - Update those usages to the new `ValidatedProject` type; or
     - Keep the public signature as `Project[]` temporarily but internally assert via Zod.

3. **Error Typing for Validation**  
   - We will treat Zod's `ZodError` as a distinct failure mode at the validation boundary but **rethrow** as a standard `Error` (or wrapped error) so existing error boundaries and `handleError` flow remain simple.
   - Optionally, we can introduce a discriminated error type later (e.g., `SanityValidationError`) if we want finer-grained handling.

[Files]
Create a centralized Zod schema module and integrate it into existing Sanity-related files, minimizing touchpoints and duplication.

Detailed breakdown:

- **New files to be created**

  1. `src/lib/sanity/schemas.ts`
     - Purpose: House all Zod schemas for Sanity documents used by the app (starting with `Project`).
     - Contents:
       - Shared primitives: `LinkSchema`, `ImageReferenceSchema`, and any other reusable fragments.
       - Document schemas: `ProjectSchema`, `ProjectsSchema` (initially), with TODO blocks for `Navigation`, `Settings`, `Page`, and `Cv`.
       - Exported inferred types: `ValidatedProject`, `ValidatedProjects`.

  2. `src/lib/sanity/validation.ts` (or extend existing `helpers.ts` if preferred)
     - Purpose: Provide reusable helpers to validate Sanity responses with Zod in a consistent way.
     - Contents (planned):
       - `validateSanityData` generic helper that wraps `schema.parse` with contextual error messages.
       - Optionally a `safeValidateSanityData` variant that uses `safeParse` for future graceful-degradation use cases.

- **Existing files to be modified**

  1. `src/app/prosjekter/actions.ts`
     - Integrate Zod validation into `fetchProjectsFromSanity` (or into `getProjects`) by:
       - Importing `ProjectsSchema` (and possibly `ValidatedProjects`).
       - Parsing `client.fetch` results through `ProjectsSchema.parse(rawData)`.
       - Adopting the default **fail-fast** strategy: throw on validation error so the route-level error boundary or app-level error boundary handles it.
       - Ensuring the public API (`getProjects`) returns a strongly-typed array of validated projects.

  2. `src/lib/sanity/helpers.ts`
     - If this file currently contains generic helpers (to be inspected in detail during implementation), either:
       - Add a `validateSanityData` helper here; or
       - Export from `validation.ts` and re-export here for a single public entrypoint.

  3. `src/app/RootLayout.tsx` and any other server components/direct loaders using `client.fetch`
     - For this plan, we will **not** immediately retrofit all existing fetches, but we will:
       - Identify each place that calls `client.fetch` directly with a Sanity query.
       - Document a consistent pattern for later adoption (e.g., wrap in a `getNavigation`/`getSettings` function that validates data using their respective schemas).

  4. (Optional but recommended) Test files under `src/__tests__/Prosjekter/`
     - Add tests verifying that:
       - Valid Sanity data passes `ProjectsSchema` validation.
       - Known-invalid shapes throw a validation error.
       - `getProjects` surfaces validation failures through the existing error handling path.

- **Files to be deleted or moved**

  - None planned. All changes are additive and localized to keep risk low.

- **Configuration file updates**

  - None required for Zod itself (already present as a dependency).
  - Optionally, add `src/lib/sanity/schemas.ts` and `validation.ts` to any path aliases or ESLint import rules if those exist, but this is unlikely to be necessary.

[Functions]
Introduce a thin validation layer around Sanity fetches and keep the integration minimal and composable.

Detailed breakdown:

- **New functions**

  1. `validateSanityData`
     - **Signature** (in `src/lib/sanity/validation.ts`):
       ```ts
       import type { ZodSchema } from "zod";

       export function validateSanityData<T>(
         schema: ZodSchema<T>,
         data: unknown,
         context: string,
       ): T;
       ```
     - **Purpose**:
       - Wrap `schema.parse(data)`.
       - On success: return typed data `T`.
       - On failure: log a concise, contextual message (including `context`, the error path(s), and possibly a redacted sample of the data) and rethrow the `ZodError` or a new `Error` summarizing the issue.
       - This function centralizes logging and makes it trivial to adjust behavior later (e.g., integrate with an error monitoring service).

  2. (Optional) `safeValidateSanityData`
     - **Signature**:
       ```ts
       export function safeValidateSanityData<T>(
         schema: ZodSchema<T>,
         data: unknown,
       ): { success: true; data: T } | { success: false; error: ZodError };
       ```
     - **Purpose**:
       - Use `schema.safeParse(data)`.
       - Intended for future areas where graceful degradation (skipping bad items, showing partial data) is desired.
       - Not required for the initial `Project` implementation, but designing for it now will simplify later improvements.

- **Modified functions**

  1. `fetchProjectsFromSanity` in `src/app/prosjekter/actions.ts`
     - **Current**:
       ```ts
       async function fetchProjectsFromSanity(): Promise<Project[]> {
         return client.fetch(
           projectsQuery,
           {},
           {
             next: { revalidate: 3600 },
           },
         );
       }
       ```

     - **Planned**:
       ```ts
       import { ProjectsSchema, type ValidatedProjects } from "@/lib/sanity/schemas";
       import { validateSanityData } from "@/lib/sanity/validation";

       async function fetchProjectsFromSanity(): Promise<ValidatedProjects> {
         const rawData = await client.fetch(
           projectsQuery,
           {},
           {
             next: { revalidate: 3600 },
           },
         );

         return validateSanityData(ProjectsSchema, rawData, "projectsQuery");
       }
       ```

     - **Behavior change**:
       - If Sanity returns data that doesn't match `ProjectsSchema`, the function will throw a validation error, which will be caught by `getProjects`'s `try/catch` and handled by `handleError` / error boundaries.

  2. `getProjects` in `src/app/prosjekter/actions.ts`
     - Keep the public API similar but consider adjusting the return type:
       ```ts
       export const getProjects = cache(async (): Promise<ValidatedProjects> => {
         try {
           return await fetchProjectsFromSanity();
         } catch (error) {
           handleError(error);
         }
       });
       ```

     - If necessary for compatibility, we can:
       - Alias `ValidatedProject` to `Project` if their shapes remain aligned; or
       - Update consuming components to use `ValidatedProject` explicitly.

  3. `handleError` in `src/app/prosjekter/actions.ts`
     - Optionally augment to treat Zod validation failures distinctly if desired:
       - Detect `instanceof ZodError` and either:
         - Wrap in a more descriptive `Error` (e.g., `new Error("Invalid Sanity data for projects")`), or
         - Attach the original error as a `cause`.
       - For the first iteration, we can keep the existing behavior and allow the thrown validation error to propagate as a generic failure; the key value is that the logs and stack trace will show the validation issue.

- **Removed functions**

  - None planned. The approach is strictly additive/modifying existing functions in place.

[Classes]
No new classes are required; this feature is implemented entirely via functions and types.

Detailed breakdown:

- **New classes**
  - None.

- **Modified classes**
  - None.

- **Removed classes**
  - None.

[Dependencies]
No new external dependencies are required; Zod is already present.

Detailed breakdown:

- **New packages**
  - None. We will reuse the existing `zod` dependency listed in `package.json`.

- **Version changes**
  - None required for this feature.

- **Integration requirements**
  - Ensure tree-shakable imports from `zod` (standard `import { z } from "zod";`).
  - No additional configuration or plugins are necessary.

[Implementation Order]
Implement the Zod/Sanity integration in small, verifiable steps, starting with `Project` data and leaving clear extension points for other Sanity types.

1. **Create core Zod schemas for Sanity data (Project-first)**
   - Add `src/lib/sanity/schemas.ts` with `LinkSchema`, `ImageReferenceSchema`, `ProjectSchema`, `ProjectsSchema`, and `ValidatedProject`/`ValidatedProjects` types.
   - Ensure the schema aligns with the `projectsQuery` projection and the existing `Project` usage in components.

2. **Introduce a reusable validation helper**
   - Add `src/lib/sanity/validation.ts` (or use `helpers.ts`) with `validateSanityData`.
   - Implement logging and fail-fast behavior for invalid data.

3. **Wire validation into project fetching**
   - Update `fetchProjectsFromSanity` in `src/app/prosjekter/actions.ts` to:
     - Fetch raw data from Sanity.
     - Validate it via `validateSanityData(ProjectsSchema, rawData, "projectsQuery")`.
   - Update `getProjects` to return the validated type and continue using `handleError` for error propagation.

4. **Align consuming code with validated types**
   - Review components/pages that consume `getProjects` (e.g., `/prosjekter` page and `ProsjektCard` components).
   - Confirm type compatibility with `ValidatedProject` and adjust types if needed (most fields are optional already, so changes should be minimal).

5. **Define patterns for future Sanity types**
   - Add TODO comments or skeleton schemas in `schemas.ts` for `Navigation`, `Settings`, `Page`, and `Cv`.
   - Document, in code comments, the pattern for adding validation when new queries are introduced: "Define a Zod schema that matches the GROQ projection, then validate inside the fetch helper before returning data to components."

6. **(Optional) Add targeted tests for validation**
   - Add unit tests under `src/__tests__/Prosjekter/` to validate:
     - Good data passes `ProjectsSchema`.
     - Bad data fails with clear errors.
     - `getProjects` surfaces failures through existing error handling.
