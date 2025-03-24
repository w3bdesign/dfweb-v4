import fs from 'fs/promises';
import path from 'path';
import type { TestResult } from './types';

async function extractCypressResults(): Promise<Partial<TestResult>> {
  try {
    const coverageDir = path.join(process.cwd(), 'coverage');
    const files = await fs.readdir(coverageDir);
    const coverageFile = files.find(f => f.startsWith('coverage-final.json'));
    
    if (!coverageFile) {
      return {
        coverage: 0,
        requirementsMet: 0,
        requirementsTotal: 0,
        status: '❌',
        issues: []
      };
    }

    const coverage = JSON.parse(
      await fs.readFile(path.join(coverageDir, coverageFile), 'utf-8')
    );

    const totalStatements = Object.values(coverage).reduce((acc: number, file: any) => 
      acc + file.statementMap ? Object.keys(file.statementMap).length : 0, 0);
    
    const coveredStatements = Object.values(coverage).reduce((acc: number, file: any) => 
      acc + file.s ? Object.values(file.s).filter(Boolean).length : 0, 0);

    const coveragePercent = Math.round((coveredStatements / totalStatements) * 100);
    
    // Find components with low coverage
    const issues = Object.entries(coverage)
      .filter(([_, file]: [string, any]) => {
        const statements = Object.keys(file.statementMap || {}).length;
        const covered = Object.values(file.s || {}).filter(Boolean).length;
        return (covered / statements) * 100 < 80;
      })
      .map(([file, data]: [string, any]) => {
        const statements = Object.keys(data.statementMap || {}).length;
        const covered = Object.values(data.s || {}).filter(Boolean).length;
        const fileCoverage = Math.round((covered / statements) * 100);
        return {
          file: file.replace(process.cwd(), ''),
          coverage: fileCoverage,
          message: `Component test coverage: ${fileCoverage}%`
        };
      });

    return {
      coverage: coveragePercent,
      requirementsMet: issues.length === 0 ? 1 : 0,
      requirementsTotal: 1,
      status: coveragePercent >= 80 ? '✅' : '❌',
      issues
    };
  } catch (error) {
    console.error('Error extracting Cypress results:', error);
    return {
      coverage: 0,
      requirementsMet: 0,
      requirementsTotal: 1,
      status: '❌',
      issues: [{
        file: 'cypress',
        coverage: 0,
        message: 'Failed to extract Cypress test results'
      }]
    };
  }
}

extractCypressResults()
  .then(results => console.log(JSON.stringify(results, null, 2)))
  .catch(console.error);
