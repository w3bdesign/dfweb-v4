interface TestResult {
  coverage: number;
  requirementsMet: number;
  requirementsTotal: number;
  status: '✅' | '⚠️' | '❌';
  issues: Array<{
    file: string;
    coverage: number;
    message?: string;
  }>;
}

interface AggregatedResults {
  unit: TestResult;
  component: TestResult;
  e2e: TestResult;
  accessibility: Omit<TestResult, 'coverage'>;
  performance: Omit<TestResult, 'coverage'> & {
    score?: number;
  };
}

interface CoverageData {
  total: {
    statements: {
      pct: number;
    };
  };
  [key: string]: {
    statements: {
      pct: number;
    };
  };
}

interface CoverageMetric {
  statements: {
    pct: number;
  };
}

function calculateCoverage(data: unknown): number {
  if (!data) return 0;
  if (typeof data === 'number') return data;
  
  const coverage = data as Partial<CoverageMetric>;
  return coverage.statements?.pct || 0;
}

function getTestStatus(coverage: number, threshold = 80): '✅' | '⚠️' | '❌' {
  if (coverage >= 90) return '✅';
  if (coverage >= threshold) return '⚠️';
  return '❌';
}

async function aggregateTestResults(): Promise<AggregatedResults> {
  const results: AggregatedResults = {
    unit: {
      coverage: 0,
      requirementsMet: 0,
      requirementsTotal: 0,
      status: '❌',
      issues: []
    },
    component: {
      coverage: 0,
      requirementsMet: 0,
      requirementsTotal: 0,
      status: '❌',
      issues: []
    },
    e2e: {
      coverage: 0,
      requirementsMet: 0,
      requirementsTotal: 0,
      status: '❌',
      issues: []
    },
    accessibility: {
      requirementsMet: 0,
      requirementsTotal: 0,
      status: '❌',
      issues: []
    },
    performance: {
      requirementsMet: 0,
      requirementsTotal: 0,
      status: '❌',
      issues: []
    }
  };

  try {
    // Aggregate Jest results
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const jestCoverage = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), 'coverage', 'coverage-summary.json'),
        'utf-8'
      )
    ) as CoverageData;
    
    results.unit.coverage = calculateCoverage(jestCoverage.total);
    results.unit.status = getTestStatus(results.unit.coverage);
    
    // Find components below threshold
    Object.entries(jestCoverage).forEach(([file, metrics]) => {
      if (file !== 'total' && calculateCoverage(metrics) < 80) {
        results.unit.issues.push({
          file,
          coverage: calculateCoverage(metrics)
        });
      }
    });

    // Aggregate Cypress results if available
    try {
      const cypressResults = JSON.parse(
        await fs.readFile(
          path.join(process.cwd(), 'test-reports', 'cypress-summary.json'),
          'utf-8'
        )
      );
      results.component = {
        ...results.component,
        ...cypressResults,
        status: getTestStatus(cypressResults.coverage)
      };
    } catch (e) {
      console.warn('No Cypress results found');
    }

    // Aggregate Playwright results if available
    try {
      const playwrightResults = JSON.parse(
        await fs.readFile(
          path.join(process.cwd(), 'test-reports', 'playwright-summary.json'),
          'utf-8'
        )
      );
      results.e2e = {
        ...results.e2e,
        ...playwrightResults,
        status: getTestStatus(playwrightResults.coverage)
      };
    } catch (e) {
      console.warn('No Playwright results found');
    }

    // Aggregate pa11y results if available
    try {
      const a11yResults = JSON.parse(
        await fs.readFile(
          path.join(process.cwd(), 'test-reports', 'pa11y-summary.json'),
          'utf-8'
        )
      );
      results.accessibility = {
        ...results.accessibility,
        ...a11yResults,
        status: a11yResults.issues.length === 0 ? '✅' : '❌'
      };
    } catch (e) {
      console.warn('No pa11y results found');
    }

    // Aggregate Lighthouse results if available
    try {
      const lhResults = JSON.parse(
        await fs.readFile(
          path.join(process.cwd(), 'test-reports', 'lighthouse-summary.json'),
          'utf-8'
        )
      );
      results.performance = {
        ...results.performance,
        ...lhResults,
        score: lhResults.score,
        status: lhResults.score >= 90 ? '✅' : lhResults.score >= 80 ? '⚠️' : '❌'
      };
    } catch (e) {
      console.warn('No Lighthouse results found');
    }

  } catch (error) {
    console.error('Error aggregating test results:', error);
  }

  return results;
}

export default aggregateTestResults;
