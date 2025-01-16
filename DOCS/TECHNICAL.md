# DFWeb v4 - Technical Documentation

## Project Overview

DFWeb v4 is a modern portfolio website built with Next.js 15, React 19, TypeScript, and Sanity.io as a headless CMS. The project showcases advanced web development practices including server components, comprehensive testing, accessibility standards, and modern animation techniques.

## Core Technologies

### Frontend Stack
- **Next.js 15**: App Router architecture with server components
- **React 19**: Latest React features and patterns
- **TypeScript**: Full type coverage
- **Motion**: Animation library for smooth transitions
- **Tailwind CSS**: Utility-first styling
- **Sanity.io**: Headless CMS for content management

### Development & Testing
- **Jest & React Testing Library**: Unit testing
- **Cypress**: E2E testing with accessibility checks
- **Playwright**: Cross-browser testing
- **ESLint & Prettier**: Code quality and formatting
- **Ladle**: Component documentation and testing

## Project Architecture

### Directory Structure
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
MODEL_NAME=claude-3.5-sonnet@anthropic
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

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity.io Documentation](https://www.sanity.io/docs)
- [Motion Documentation](https://motion.dev/docs)
- [Testing Library Documentation](https://testing-library.com/docs/)
