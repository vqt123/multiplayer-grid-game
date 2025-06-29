module.exports = {
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'server',
      testMatch: ['<rootDir>/server/__tests__/**/*.test.js'],
      testEnvironment: 'node'
    },
    {
      displayName: 'client',
      testMatch: ['<rootDir>/client/__tests__/**/*.test.js'],
      testEnvironment: 'jsdom'
    }
  ],
  collectCoverageFrom: [
    'server/**/*.js',
    'client/**/*.js',
    '!**/__tests__/**',
    '!**/node_modules/**'
  ]
};