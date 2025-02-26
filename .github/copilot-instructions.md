# DFWeb v4 - Copilot Instructions

## Project Overview
DFWeb v4 is a portfolio website built with Next.js 15, React 19, and TypeScript, featuring a Matrix-inspired design with custom animations and a strong focus on performance and accessibility.

## Tech Stack
- **Frontend Core**
  - Next.js 15 with App Router and Server Components
  - React 19 with latest features
  - TypeScript with strict mode
  - Motion for animations
  - Tailwind CSS for styling
  - Sanity.io as headless CMS

- **Testing**
  - Jest & React Testing Library for unit tests
  - Cypress for E2E testing with accessibility checks
  - Playwright for cross-browser testing
  - 100% test coverage requirement

- **Performance & Monitoring**
  - Lighthouse CI integration
  - Vercel Speed Insights
  - Core Web Vitals monitoring
  - Performance budgets

## Code Organization
```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── Animations/     # Animation components
│   ├── CV/            # CV-related components
│   ├── ErrorBoundary/ # Error handling
│   ├── Index/         # Homepage components
│   ├── Kontakt/       # Contact form
│   ├── Layout/        # Layout components
│   ├── Prosjekter/    # Projects section
│   └── UI/            # Reusable UI components
├── config/             # Configuration files
├── e2e/               # End-to-end tests
├── hooks/             # Custom React hooks
├── lib/               # Core libraries
├── stories/           # Component documentation
├── types/             # TypeScript definitions
└── utils/             # Utility functions
```

## Coding Standards

### TypeScript
- Use strict type checking
- Avoid `any` types
- Create proper interfaces/types for all data structures
- Use type guards where appropriate
- Leverage TypeScript's utility types

### Components
- Use functional components with hooks
- Follow naming convention: `ComponentName.component.tsx`
- Keep components focused and modular
- Implement proper error boundaries
- Use proper React key props in lists
- Prefer Server Components where possible

### Testing
- Follow AAA (Arrange-Act-Assert) pattern
- Include comments for each section:
  ```typescript
  // Arrange - Set up test data and conditions
  // Act - Perform the action being tested
  // Assert - Verify the results
  ```
- Write comprehensive unit tests
- Include integration tests for complex features
- Add E2E tests for critical flows
- Maintain 100% test coverage

### State Management
- Use React hooks for local state
- Implement proper loading states
- Handle errors with ErrorBoundary
- Use Server Components for data fetching
- Avoid prop drilling

### Performance
- Use Server Components for data-heavy pages
- Implement proper caching strategies
- Optimize images with next/image
- Use code splitting effectively
- Monitor Core Web Vitals
- Keep bundle size minimal

### Accessibility
- Follow WCAG guidelines
- Use semantic HTML
- Implement proper ARIA attributes
- Ensure keyboard navigation
- Test with screen readers
- Support reduced motion

### Error Handling
- Use ErrorBoundary components
- Provide meaningful error messages
- Include fallback UI
- Log errors appropriately
- Handle edge cases

### CSS/Styling
- Use Tailwind CSS classes
- Follow mobile-first approach
- Maintain consistent spacing
- Use CSS modules for component-specific styles
- Follow BEM naming convention when needed

## Best Practices

### Git Workflow
- Use descriptive commit messages
- Follow conventional commits specification
- Create focused PRs
- Include tests with changes
- Update documentation

### Development Process
- Start with Server Components
- Implement proper error handling
- Add comprehensive tests
- Consider accessibility
- Monitor performance
- Document changes

### Environment Variables
Required variables:
```env
# Email Configuration (client-side)
NEXT_PUBLIC_EMAIL_API_KEY=user_xxx
NEXT_PUBLIC_EMAIL_TEMPLATE_KEY=template_xxx
NEXT_PUBLIC_EMAIL_SERVICE_KEY=service_xxx

# AI Configuration (server-side)
AI_API_KEY=xxx
AI_BASE_URL=xxx
MODEL_NAME=claude-3.7-sonnet@anthropic
```

## Important Notes
- Always handle loading and error states
- Implement proper TypeScript types
- Follow existing patterns in the codebase
- Consider mobile responsiveness
- Maintain accessibility standards
- Write comprehensive tests
- Optimize for performance
- Use Server Components where possible
- Keep components focused and modular
- Document complex logic
