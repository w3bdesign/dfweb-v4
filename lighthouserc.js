module.exports = {
  ci: {
    collect: {
      // Number of runs to perform per URL
      numberOfRuns: 1,
      // URLs to analyze
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/cv',
        'http://localhost:3000/prosjekter',
        'http://localhost:3000/kontakt'
      ],
      // URLs to analyze
    },
    upload: {
      // Upload results to temporary public storage
      target: 'temporary-public-storage',
    },
    assert: {
      // Performance score thresholds
      assertions: {
        'categories:performance': ['error', { minScore: 0.6 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
};
