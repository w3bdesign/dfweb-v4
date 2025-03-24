import fs from 'fs/promises';
import path from 'path';
import type { TestResult } from './types';

interface PlaywrightResult {
  suites: Array<{
    title: string;
    specs: Array<{
      tests: Array<{
        results: Array<{
          status: 'passed' | 'failed' | 'skipped';
        }>;
      }>;
    }>;
  }>;
}

async function extractPlaywrightResults(): Promise<Partial<TestResult>> {
  try {
    const resultsPath = path.join(process.cwd(), 'playwright-report', 'results.json');
    const results = JSON.parse(await fs.readFile(resultsPath, 'utf-8')) as PlaywrightResult;

    let totalTests = 0;
    let passedTests = 0;
    const issues: Array<{ file: string; coverage: number; message: string }> = [];

    // Process test results
    results.suites.forEach(suite => {
      const suiteTests = suite.specs.reduce((acc, spec) => {
        return acc + spec.tests.reduce((testAcc, test) => {
          return testAcc + test.results.length;
        }, 0);
      }, 0);

      const suitePassed = suite.specs.reduce((acc, spec) => {
        return acc + spec.tests.reduce((testAcc, test) => {
          return testAcc + test.results.filter(r => r.status === 'passed').length;
        }, 0);
      }, 0);

      totalTests += suiteTests;
      passedTests += suitePassed;

      // If suite has failures, add to issues
      if (suitePassed < suiteTests) {
        const coverage = Math.round((suitePassed / suiteTests) * 100);
        issues.push({
          file: suite.title,
          coverage,
          message: `E2E suite "${suite.title}" has failing tests (${coverage}% passing)`
        });
      }
    });

    const coverage = totalTests ? Math.round((passedTests / totalTests) * 100) : 0;

    return {
      coverage,
      requirementsMet: issues.length === 0 ? 1 : 0,
      requirementsTotal: 1,
      status: coverage >= 80 ? '✅' : '❌',
      issues
    };
  } catch (error) {
    console.error('Error extracting Playwright results:', error);
    return {
      coverage: 0,
      requirementsMet: 0,
      requirementsTotal: 1,
      status: '❌',
      issues: [{
        file: 'playwright',
        coverage: 0,
        message: 'Failed to extract Playwright test results'
      }]
    };
  }
}

extractPlaywrightResults()
  .then(results => console.log(JSON.stringify(results, null, 2)))
  .catch(console.error);
