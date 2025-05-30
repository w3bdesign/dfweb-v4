# DFWeb v4 - Technical Documentation

## Project Overview

DFWeb v4 is a modern portfolio website that demonstrates advanced web
development practices and architectural patterns. Built with Next.js 15, React
19, TypeScript, and Sanity.io, it showcases several key technical achievements:

### Technical Highlights

1. **Advanced React Patterns**
   - Server Components for optimal performance and SEO
   - Custom hooks for shared logic (e.g., useMobile, useNavigation)
   - Error Boundaries with fallback UI strategies
   - Polymorphic components for flexible implementations

2. **Performance Optimizations**
   - 100/100 Lighthouse scores across all metrics
   - Efficient code splitting and lazy loading
   - Image optimization with next/image
   - Strategic use of static and dynamic rendering

3. **Type Safety**
   - Comprehensive TypeScript implementation
   - Custom type utilities and guards
   - Zod schema validation for runtime safety
   - Type-safe API integrations

4. **Testing Excellence**
   - 100% test coverage with Jest and RTL
   - E2E testing with Cypress and Playwright
   - Custom ESLint rules enforcing AAA pattern
   - Automated accessibility testing

5. **Modern UI/UX**
   - Matrix-inspired design with custom animations
   - Responsive layouts with Tailwind CSS
   - Custom cursor effects with trail animations
   - Smooth page transitions and scroll effects

## Core Technologies

### Technical Stack Deep Dive

#### Frontend Core

- **Next.js 15**
  - App Router for enhanced routing control
  - Server Components for improved performance
  - Streaming and Suspense for progressive loading
  - Middleware for request/response manipulation

- **React 19**
  - Server Components integration
  - Use of latest hooks (useFormStatus, useOptimistic)
  - Custom hooks for business logic
  - Error Boundary implementation

- **TypeScript**
  - Strict type checking enabled
  - Custom type utilities and guards
  - Generic components implementation
  - Type-safe API integrations

- **Motion**
  - Custom animation hooks
  - Performance-optimized animations
  - Gesture handling
  - Scroll-based animations

- **Tailwind CSS**
  - Custom configuration and theming
  - Responsive design implementation
  - Dark mode support
  - Performance optimization

- **Sanity.io**
  - Custom schema definitions
  - Type-safe GROQ queries
  - Real-time content updates
  - Image optimization pipeline

#### Development & Testing Infrastructure

- **Jest & React Testing Library**
  - Custom test utilities and helpers
  - Mock implementations for external services
  - Snapshot testing strategies
  - Integration with TypeScript

- **Cypress**
  - Custom commands for common operations
  - Accessibility testing integration
  - Visual regression testing
  - Network request stubbing

- **Playwright**
  - Cross-browser testing setup
  - Mobile device emulation
  - Performance testing
  - Screenshot and video capture

- **ESLint & Prettier**
  - Custom rule configurations
  - Git hooks integration
  - TypeScript-aware linting
  - Automated code formatting

- **Ladle**
  - Interactive component documentation
  - Visual regression testing
  - Accessibility testing
  - Performance profiling

## Project Architecture

### Directory Structure

```text
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

### Key Features

#### 1. Server Components & Data Fetching

- Server-side rendering for optimal performance
- Streaming with Suspense boundaries
- Automatic static optimization with revalidation
- Type-safe environment variables using envalid

#### 2. Animation System

- Matrix-inspired animations and effects
- Custom cursor with matrix trail effect
- Page transitions and scroll animations
- Motion library integration

#### 3. Form Handling

- React Hook Form with TypeScript
- Zod schema validation
- Reusable GenericForm component
- Email.js integration for contact form

#### 4. Testing Infrastructure

- Jest and React Testing Library for unit tests
- Cypress for E2E testing with accessibility checks
- Playwright for cross-browser testing
- Custom ESLint rules enforcing AAA pattern

#### 5. Error Handling

- Custom ErrorBoundary components
- Fallback UI for different error scenarios
- Development mode error triggers
- Comprehensive error logging

## Development Practices

### Testing Standards

All tests must follow the AAA (Arrange-Act-Assert) pattern:

```typescript
describe('Component', () => {
  it('should do something', () => {
    // Arrange - Set up test data and conditions
    const props = {...}

    // Act - Perform the action being tested
    render(<Component {...props} />)

    // Assert - Verify the results
    expect(...).toBe(...)
  })
})
```

### Code Quality

- ESLint configuration with strict rules
- Custom ESLint plugin for test patterns
- Prettier for consistent formatting
- TypeScript strict mode enabled

### Accessibility

- WCAG compliance testing
- Cypress Axe integration
- Skip links and ARIA labels
- Keyboard navigation support

### Performance Monitoring

- Lighthouse CI integration
- Performance budgets
- Automated performance testing
- Bundle size monitoring

## Content Management

### Sanity.io Integration

- Headless CMS for content
- Type-safe queries using GROQ
- Image optimization
- Real-time content updates

### Schema Types

- Projects
- Categories
- Pages
- Navigation
- CV content

## Deployment & CI/CD

### GitHub Actions Workflows

- Cypress tests
- Lighthouse CI
- CodeQL analysis
- Cross-browser testing

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

## Getting Started

### Prerequisites

- Node.js >= 20.16.0
- pnpm (recommended package manager)

### Development Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build
pnpm build

# Testing
pnpm test              # Run unit tests
pnpm cypress:open      # Open Cypress
pnpm e2e              # Run E2E tests
pnpm test:watch       # Watch mode

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code

# Performance Testing
pnpm lhci             # Run Lighthouse CI
pnpm lhci:perf        # Performance testing
pnpm lhci:desktop     # Desktop testing

# Component Documentation
pnpm ladle            # Start Ladle server
```

## Best Practices

### Component Development

1. Use TypeScript for all new components
2. Include comprehensive tests
3. Document with Ladle stories
4. Ensure accessibility compliance
5. Optimize for performance

### State Management

1. Use React hooks for local state
2. Implement context where needed
3. Keep state close to where it's used
4. Avoid prop drilling

### Error Handling

1. Use ErrorBoundary components
2. Provide meaningful error messages
3. Include fallback UI
4. Log errors appropriately

### Performance

1. Use server components where possible
2. Implement proper caching strategies
3. Optimize images and assets
4. Monitor bundle sizes

## Future Improvements

See TODO.md for detailed plans including:

1. Project structure reorganization
2. Enhanced caching strategy
3. Feature-based organization
4. Turbopack integration
5. Additional performance optimizations

## Contributing

1. Follow the AAA pattern for tests
2. Ensure accessibility compliance
3. Maintain type safety
4. Update documentation
5. Follow commit message conventions

## Repository Context File

The `repository_context.txt` file is a merged representation of the entire
codebase, combining all repository files into a single document. It is designed
to be easily consumable by AI systems for analysis, code review, or other
automated processes.

### Purpose

- **Unified View**: Provides a unified view of the codebase for AI analysis.
- **Facilitates Automation**: Assists in code review and automated testing
  procedures.
- **Important Context**: Contains crucial context and guidelines specific to this
  project.

### Usage Guidelines

- **Read-Only**: Do not edit `repository_context.txt` directly. Make changes in
  the original repository files.
- **Sensitive Information**: Handle with caution as it may contain sensitive
  data.
- **File Paths**: Use the file paths within the document to distinguish between
  different files in the repository.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity.io Documentation](https://www.sanity.io/docs)
- [Motion Documentation](https://motion.dev/docs)
- [Testing Library Documentation](https://testing-library.com/docs/)
