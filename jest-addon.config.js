module.exports = {
  roots: ['<rootDir>/../../../packages'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    '<rootDir>/../../../packages/**/src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
  ],
  transformIgnorePatterns: ['node_modules/(?!(volto-slate|@plone/volto)/)'],
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },
};
