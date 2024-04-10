/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  bail: 1,
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  errorOnDeprecated: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: ["**/?(*.)+(spec).ts"],
  collectCoverage: false,
  collectCoverageFrom: ["./**/*.ts"],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};