import type { AggregatedResults, TestResult } from './types';

function calculateOverallCompliance(results: AggregatedResults): number {
  const metrics = [
    results.unit.coverage,
    results.component.coverage,
    results.e2e.coverage,
    (results.performance.requirementsMet / results.performance.requirementsTotal) * 100,
    (results.accessibility.requirementsMet / results.accessibility.requirementsTotal) * 100
  ].filter(Boolean);

  return metrics.length ? Math.round(metrics.reduce((a, b) => a + b, 0) / metrics.length) : 0;
}

function formatTestRow(type: string, result: TestResult | Omit<TestResult, 'coverage'>): string {
  const coverage = 'coverage' in result ? `${result.coverage}%` : '-';
  return `| ${type} | ${result.status} | ${coverage} | ${result.requirementsMet}/${result.requirementsTotal} |`;
}

function generateSummaryTable(results: AggregatedResults): string {
  const header = `| Test Type | Status | Coverage | Requirements |
|-----------|--------|----------|-------------|`;
  
  const rows = [
    formatTestRow('Unit Tests', results.unit),
    formatTestRow('Component Tests', results.component),
    formatTestRow('E2E Tests', results.e2e),
    formatTestRow('Accessibility', results.accessibility),
    formatTestRow('Performance', results.performance)
  ];

  return [header, ...rows].join('\n');
}

function formatIssues(type: string, issues: TestResult['issues']): string | null {
  return issues.length ? `
### ${type} Issues
${issues.map(issue => `- ${issue.message || `\`${issue.file}\` (${issue.coverage}%)`}`).join('\n')}` : null;
}

function generateIssuesSection(results: AggregatedResults): string {
  const sections = [
    formatIssues('Unit Test', results.unit.issues),
    formatIssues('Component Test', results.component.issues),
    formatIssues('E2E Test', results.e2e.issues),
    formatIssues('Accessibility', results.accessibility.issues),
    formatIssues('Performance', results.performance.issues)
  ].filter(Boolean);

  return sections.length ? `\n\n## Issues Requiring Attention\n${sections.join('\n')}` : '';
}

function generateTestStrategyComment(results: AggregatedResults): string {
  const compliance = calculateOverallCompliance(results);
  const status = compliance >= 90 ? '✅' : compliance >= 80 ? '⚠️' : '❌';
  const actionRequired = compliance < 80 ? '\n\n## ❌ Action Required\nTest strategy compliance is below the required threshold of 80%. Please address the issues above.' : '';

  return `# Test Strategy Compliance: ${status} ${compliance}%

## Summary

${generateSummaryTable(results)}${generateIssuesSection(results)}${actionRequired}

[View detailed dashboard](${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/workflows/test-strategy.yml)`;
}

export default generateTestStrategyComment;
