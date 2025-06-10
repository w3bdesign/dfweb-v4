# Storybook Standards Guide

This guide provides standards for creating and maintaining stories in our project.

## Structure and Organization

Stories are organized in folders that mirror the component structure:

- `src/stories/components/UI/` - For UI components
- `src/stories/components/Layout/` - For layout components
- `src/stories/components/Animations/` - For animation components
- etc.

## Story File Format

```tsx
import React from "react";
import { Meta } from "@ladle/react";
import ComponentName from "@/components/Path/Component";
import "@/app/globals.css"; // Always include this

export default {
  title: "Category/ComponentName",
  component: ComponentName,
} as Meta;

// Default variant
export const Default = () => <ComponentName />;

// Additional variants
export const WithProps = () => <ComponentName prop="value" />;

// Complex examples with multiple components
export const ComplexExample = () => (
  <div className="container">
    <ComponentName prop="value" />
    <ComponentName prop="other value" />
  </div>
);
```

## Best Practices

1. **Direct Component Approach**: All stories should use the direct component
   approach rather than the Template.bind({}) pattern.

2. **CSS Import**: Always include `import "@/app/globals.css";` to ensure
   consistent styling.

3. **Comments**: Add a brief comment above each story variant to explain what
   it's demonstrating.

4. **Naming Conventions**:

   - Use PascalCase for story export names (e.g.,
     `export const WithCustomClass = () => ...`)
   - Use descriptive names that indicate what's special about the variant

5. **Mock Data**: When components require data from APIs or other external
   sources, create mock data within the story file or in a separate mock file.

6. **TypeScript**: Ensure all stories are properly typed.

7. **Story Variants**: Include multiple variants to showcase different states,
   props, and use cases for each component.

8. **Layout and Context**: If a component needs specific context or layout to be
   properly demonstrated, provide it within the story.

9. **Interactive Examples**: Where appropriate, include interactive examples
   with state.

10. **Accessibility**: Test and ensure components are accessible in their story
    representations.

## Mocking Dependencies

For stories that use components with external dependencies:

1. Create mock files in `src/__mocks__/` directory
2. Use proper TypeScript typing in your mocks
3. Prefer using existing types from the project where possible
