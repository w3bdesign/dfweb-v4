interface LighthouseSettings {
  onlyCategories: string[];
  skipAudits: string[];
}

interface LighthouseAssertions {
  [key: string]: [string, { minScore: number }] | string;
}

interface LighthouseCollect {
  numberOfRuns: number;
  url: string[];
  port: number;
  settings: LighthouseSettings;
}

interface LighthouseUpload {
  target: string;
}

interface LighthouseAssert {
  assertions: LighthouseAssertions;
}

interface LighthouseCI {
  collect: LighthouseCollect;
  upload: LighthouseUpload;
  assert: LighthouseAssert;
}

const lighthouseConfig: { ci: LighthouseCI } = {
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
      target: 'temporary-public-storage',
    },
    assert: {
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

export default lighthouseConfig;
