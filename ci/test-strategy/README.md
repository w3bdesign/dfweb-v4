# Test Strategy Enforcement

This system automatically enforces the testing strategy defined in `DOCS/TEST_STRATEGY.md` by:
- Aggregating results from all test tools (Jest, Cypress, Playwright, pa11y, Lighthouse)
- Calculating overall test strategy compliance
- Providing detailed feedback on PR comments
- Blocking merges when compliance falls below 80%

## How It Works

1. On each PR and push to main:
   - Runs all test suites
   - Extracts and normalizes results
   - Generates a compliance report
   - Posts results as PR comments

2. The report includes:
   - Overall compliance score
   - Per-category status (Unit, Component, E2E, Accessibility, Performance)
   - Detailed issues requiring attention
   - Links to full test reports

## Test Categories

### Unit Tests (Jest)
- Minimum 80% coverage required
- Identifies components below threshold
- Reports specific coverage gaps

### Component Tests (Cypress)
- Validates component behavior
- Tracks integration test coverage
- Reports failed component tests

### E2E Tests (Playwright)
- Verifies critical user flows
- Cross-browser testing
- Reports failed scenarios

### Accessibility (pa11y)
- WCAG 2.1 AA compliance
- Reports accessibility violations
- Tracks success criteria coverage

### Performance (Lighthouse)
- Core Web Vitals tracking
- Performance score requirements
- Best practices compliance

## PR Comments

The system adds a comment to each PR with:
```markdown
# Test Strategy Compliance: ✅ 92%

## Summary
| Test Type | Status | Coverage | Requirements |
|-----------|--------|----------|-------------|
| Unit Tests | ✅ | 95% | 15/15 |
...

## Issues Requiring Attention
### Unit Test Issues
- `src/components/Example.tsx` (75%)
...
```

## Configuration

Key thresholds:
- Overall compliance: 80%
- Unit test coverage: 80%
- Component test coverage: 80%
- E2E test coverage: 80%
- Accessibility: WCAG 2.1 AA
- Performance: Score > 90

## Scripts

Each test tool has a dedicated results extractor:
- `extract-cypress-results.ts`: Component test results
- `extract-playwright-results.ts`: E2E test results
- `extract-pa11y-results.ts`: Accessibility results
- `extract-lighthouse-results.ts`: Performance results

## Adding New Tests

1. Create test files following existing patterns
2. Update relevant extractor if needed
3. Tests will be automatically included in compliance calculations

## Exemptions

To exempt a file from coverage requirements:
1. Add to Jest coverage excludes in `package.json`
2. Document the reason in `TEST_STRATEGY.md`

## Troubleshooting

Common issues:

1. Missing test results:
   - Verify test command completed
   - Check output paths match extractors
   - Ensure JSON reports are enabled

2. Incorrect scores:
   - Review extractor logic
   - Verify test output format
   - Check calculation methods

3. PR comments not updating:
   - Verify GitHub token permissions
   - Check workflow logs
   - Ensure PR trigger is correct
