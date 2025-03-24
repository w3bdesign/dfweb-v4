export interface TestResult {
  coverage: number;
  requirementsMet: number;
  requirementsTotal: number;
  status: '✅' | '⚠️' | '❌';
  issues: Array<{
    file: string;
    coverage: number;
    message?: string;
  }>;
  score?: number; // Optional score field for performance metrics
}

export interface AggregatedResults {
  unit: TestResult;
  component: TestResult;
  e2e: TestResult;
  accessibility: Omit<TestResult, 'coverage'>;
  performance: Omit<TestResult, 'coverage'> & {
    score?: number;
  };
}

export interface CoverageData {
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

export interface CoverageMetric {
  statements: {
    pct: number;
  };
}
