# Next.js 15 Implementation TODO

This document outlines suggestions for improvements for implementing Next.js 15 features in our project.

## 1. Project Structure Reorganization

### Current Structure

Currently, our project has a flat structure in src/components with separate
folders for different component types. While organized, we can improve the
structure using Next.js 15's recommended patterns.

### Implementation Plan

1. **Create Three Main Zones**

   ```text
   src/
   ├── shared/           # Green Zone - Shared code
   │   ├── components/   # Reusable UI components
   │   ├── constants/    # Global constants
   │   ├── types/       # TypeScript types/interfaces
   │   └── utils/       # Utility functions
   │
   ├── navigation/      # Red Zone - Navigation & Data
   │   ├── routes/      # Route configurations
   │   └── data/        # Data fetching functions
   │
   └── features/        # Blue Zone - Feature modules
       ├── cv/
       ├── projects/
       ├── contact/
       └── home/
   ```

2. **Migration Steps**

   - Create the new directory structure
   - Move common components (Button, InputField, etc.) to shared/components
   - Organize feature-specific components into respective feature folders
   - Update import paths throughout the project
   - Ensure no circular dependencies between zones

3. **Rules to Follow**
   - Shared (Green) zone: No imports from other zones
   - Navigation (Red) zone: Can import from shared
   - Features (Blue) zone: Can import from shared and navigation
   - No imports between feature modules

## 3. Enhanced Caching Strategy

### Current Caching

We currently rely on Next.js's default caching behavior. We can improve
performance with explicit cache controls.

### Caching Implementation Plan

1. **Define Cache Profiles**

   ```typescript
   // src/shared/cache/profiles.ts
   export const cacheProfiles = {
     static: {
       revalidate: false,
       tags: ["static"],
     },
     dynamic: {
       revalidate: 3600, // 1 hour
       tags: ["dynamic"],
     },
   };
   ```

2. **Implement Cache Controls**

   ```typescript
   // src/features/projects/data.ts
   import { cache } from "react";

   export const getProjects = cache(async () => {
     // Fetch projects with caching
     const response = await fetch("/api/projects", {
       next: cacheProfiles.dynamic,
     });
     return response.json();
   });
   ```

3. **Cache Invalidation Strategy**
   - Implement revalidation endpoints
   - Set up cache tags for granular invalidation
   - Configure cache headers properly

## 4. Feature-based Organization

### Current Component Structure

Components are currently organized by type (UI, Animations, etc.). We'll
reorganize by feature for better modularity.

### Implementation Steps

1. **Feature Module Structure**

   ```text
   src/features/
   ├── cv/
   │   ├── components/
   │   ├── hooks/
   │   ├── utils/
   │   └── types.ts
   ├── projects/
   │   ├── components/
   │   ├── hooks/
   │   ├── utils/
   │   └── types.ts
   ```

2. **Migration Process**

   - Create feature directories
   - Move related components, hooks, and utilities
   - Update imports and dependencies
   - Ensure feature isolation
   - Update test file locations

3. **Feature Module Rules**
   - Each feature should be self-contained
   - Shared functionality goes in shared/
   - Feature-specific types in feature/types.ts
   - Feature-specific hooks in feature/hooks/

## 5. Turbopack Integration

### Current Build Setup

We use the default webpack configuration. Turbopack can significantly improve
build times.

### Turbopack Implementation Steps

1. **Enable Turbopack**

   ```typescript
   // next.config.ts
   const config: NextConfig = {
     experimental: {
       turbo: {
         loaders: {
           // Configure loaders
           ".svg": ["@svgr/webpack"],
         },
       },
     },
   };
   ```

2. **Performance Monitoring**

   - Measure build times before and after
   - Monitor hot reload performance
   - Check for compatibility issues
   - Document any workarounds needed

3. **Fallback Strategy**
   - Maintain webpack configuration as fallback
   - Document any Turbopack-specific issues
   - Create scripts for both build systems

## Additional Considerations

### Testing Strategy

- Update test file locations to match new structure
- Ensure all server actions are properly tested
- Add integration tests for new caching behavior
- Maintain current test coverage

### Documentation

- Update component documentation
- Document new folder structure
- Create migration guide for team
- Update README.md with new architecture

### Performance Monitoring

- Set up metrics for before/after comparison
- Monitor cache hit rates
- Track build times
- Measure Time to First Byte (TTFB)

## Migration Timeline

1. **Phase 1: Project Structure (Week 1-2)**

   - Set up new directory structure
   - Move files to new locations
   - Update import paths
   - Verify all tests pass

2. **Phase 2: Server Actions (Week 3)**

   - Implement server actions
   - Update form handling
   - Add validation
   - Test new functionality

3. **Phase 3: Caching (Week 4)**

   - Implement cache profiles
   - Update data fetching
   - Set up revalidation
   - Monitor performance

4. **Phase 4: Feature Organization (Week 5)**

   - Organize by feature
   - Update documentation
   - Verify functionality
   - Run performance tests

5. **Phase 5: Turbopack (Week 6)**
   - Enable Turbopack
   - Monitor performance
   - Fix any issues
   - Document findings

## Success Metrics

- Build time reduction of 40%+
- Improved lighthouse scores
- Reduced TTFB
- Maintained or improved test coverage
- Successful integration of all Next.js 15 features
- Positive developer feedback on new structure

This TODO list serves as a comprehensive guide for implementing Next.js 15
features in our project. Each section should be reviewed and adjusted as needed
during implementation.
