import fs from 'fs/promises';
import path from 'path';
import type { TestResult } from './types';

interface LighthouseResult {
  categories: {
    performance: {
      score: number;
    };
    accessibility: {
      score: number;
    };
    'best-practices': {
      score: number;
    };
    seo: {
      score: number;
    };
  };
  audits: {
    [key: string]: {
      score: number;
      numericValue?: number;
      displayValue?: string;
      title: string;
      description: string;
    };
  };
}

async function extractLighthouseResults(): Promise<Partial<TestResult>> {
  try {
    const resultsDir = path.join(process.cwd(), '.lighthouseci');
    const files = await fs.readdir(resultsDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      throw new Error('No Lighthouse results found');
    }

    const allResults = await Promise.all(
      jsonFiles.map(async file => 
        JSON.parse(await fs.readFile(path.join(resultsDir, file), 'utf-8')) as LighthouseResult
      )
    );

    // Calculate average scores
    const scores = allResults.map(result => ({
      performance: result.categories.performance.score * 100,
      accessibility: result.categories.accessibility.score * 100,
      bestPractices: result.categories['best-practices'].score * 100,
      seo: result.categories.seo.score * 100
    }));

    const avgScores = {
      performance: Math.round(scores.reduce((acc, s) => acc + s.performance, 0) / scores.length),
      accessibility: Math.round(scores.reduce((acc, s) => acc + s.accessibility, 0) / scores.length),
      bestPractices: Math.round(scores.reduce((acc, s) => acc + s.bestPractices, 0) / scores.length),
      seo: Math.round(scores.reduce((acc, s) => acc + s.seo, 0) / scores.length)
    };

    // Identify issues (scores below thresholds)
    const issues = [];
    const thresholds = {
      performance: 90,
      accessibility: 90,
      bestPractices: 90,
      seo: 90
    };

    if (avgScores.performance < thresholds.performance) {
      issues.push({
        file: 'Performance',
        coverage: avgScores.performance,
        message: `Performance score (${avgScores.performance}%) is below threshold (${thresholds.performance}%)`
      });
    }

    if (avgScores.accessibility < thresholds.accessibility) {
      issues.push({
        file: 'Accessibility',
        coverage: avgScores.accessibility,
        message: `Accessibility score (${avgScores.accessibility}%) is below threshold (${thresholds.accessibility}%)`
      });
    }

    if (avgScores.bestPractices < thresholds.bestPractices) {
      issues.push({
        file: 'Best Practices',
        coverage: avgScores.bestPractices,
        message: `Best Practices score (${avgScores.bestPractices}%) is below threshold (${thresholds.bestPractices}%)`
      });
    }

    if (avgScores.seo < thresholds.seo) {
      issues.push({
        file: 'SEO',
        coverage: avgScores.seo,
        message: `SEO score (${avgScores.seo}%) is below threshold (${thresholds.seo}%)`
      });
    }

    // Add specific audit failures
    allResults.forEach((result, index) => {
      Object.entries(result.audits)
        .filter(([_, audit]) => audit.score !== null && audit.score < 0.9)
        .forEach(([id, audit]) => {
          issues.push({
            file: `Page ${index + 1}`,
            coverage: Math.round(audit.score * 100),
            message: `${audit.title}: ${audit.description}`
          });
        });
    });

    const overallScore = Math.round(
      (avgScores.performance + avgScores.accessibility + avgScores.bestPractices + avgScores.seo) / 4
    );

    return {
      requirementsMet: issues.length === 0 ? 4 : 4 - issues.length,
      requirementsTotal: 4,
      status: overallScore >= 90 ? '✅' : overallScore >= 80 ? '⚠️' : '❌',
      issues,
      score: overallScore
    };
  } catch (error) {
    console.error('Error extracting Lighthouse results:', error);
    return {
      requirementsMet: 0,
      requirementsTotal: 4,
      status: '❌',
      issues: [{
        file: 'lighthouse',
        coverage: 0,
        message: 'Failed to extract Lighthouse test results'
      }]
    };
  }
}

extractLighthouseResults()
  .then(results => console.log(JSON.stringify(results, null, 2)))
  .catch(console.error);
