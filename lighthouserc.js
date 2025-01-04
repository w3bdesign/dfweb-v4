module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/cv',
        'http://localhost:3000/prosjekter',
        'http://localhost:3000/kontakt'
      ],
      port: 3000
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
