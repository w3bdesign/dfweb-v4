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
      port: 3000,
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        skipAudits: ['uses-http2']
      }
    },
    upload: {
      // Upload results to temporary public storage
      target: 'temporary-public-storage',
    },
    assert: {
      // Performance score thresholds
      assertions: {
        'categories:performance': ['warn', { minScore: 0.6 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'uses-http2': 'off'
      },
    },
  },
};
