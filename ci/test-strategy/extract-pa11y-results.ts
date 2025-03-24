import fs from 'fs/promises';
import path from 'path';
import type { TestResult } from './types';

interface Pa11yResult {
  documentTitle: string;
  pageUrl: string;
  issues: Array<{
    code: string;
    type: 'error' | 'warning' | 'notice';
    message: string;
    context: string;
    selector: string;
  }>;
}

async function extractPa11yResults(): Promise<Partial<TestResult>> {
  try {
    const resultsPath = path.join(process.cwd(), '.pa11y-results.json');
    const results = JSON.parse(await fs.readFile(resultsPath, 'utf-8')) as Pa11yResult[];

    const totalChecks = results.reduce((acc, page) => acc + page.issues.length, 0);
    const errors = results.reduce((acc, page) => 
      acc + page.issues.filter(issue => issue.type === 'error').length, 0);
    
    const issues = results.flatMap(page => 
      page.issues
        .filter(issue => issue.type === 'error')
        .map(issue => ({
          file: page.pageUrl,
          coverage: 0, // Not applicable for accessibility issues
          message: `${issue.message} (${issue.code}) at ${issue.selector}`
        }))
    );

    // Calculate requirements met based on WCAG success criteria
    const uniqueWCAGCriteria = new Set(
      results.flatMap(page => 
        page.issues.map(issue => issue.code.split('.')[0])
      )
    );

    const totalWCAGCriteria = uniqueWCAGCriteria.size;
    const passedCriteria = totalWCAGCriteria - new Set(
      results.flatMap(page => 
        page.issues
          .filter(issue => issue.type === 'error')
          .map(issue => issue.code.split('.')[0])
      )
    ).size;

    return {
      requirementsMet: passedCriteria,
      requirementsTotal: totalWCAGCriteria,
      status: errors === 0 ? '✅' : '❌',
      issues
    };
  } catch (error) {
    console.error('Error extracting pa11y results:', error);
    return {
      requirementsMet: 0,
      requirementsTotal: 1,
      status: '❌',
      issues: [{
        file: 'accessibility',
        coverage: 0,
        message: 'Failed to extract accessibility test results'
      }]
    };
  }
}

extractPa11yResults()
  .then(results => console.log(JSON.stringify(results, null, 2)))
  .catch(console.error);
