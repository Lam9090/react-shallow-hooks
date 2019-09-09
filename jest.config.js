module.exports = {
  clearMocks: true,
  testMatch: ['<rootDir>/src/**/__tests__/*.test.{js,jsx,ts,tsx}'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts', '!src/__tests__/*'],
};
