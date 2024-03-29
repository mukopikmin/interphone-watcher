module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  verbose: true,
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/**/*.{ts,tsx}',
    '!<rootDir>/pages/api/**/*.{ts,tsx}',
  ],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/apis/(.*)$': '<rootDir>/apis/$1',
  },
}
