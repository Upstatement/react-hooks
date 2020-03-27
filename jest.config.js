module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '((\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testPathIgnorePatterns: ['node_modules', '.cache'],
  globals: {
    __PATH_PREFIX__: '',
    'ts-jest': {
      diagnostics: false,
    },
  },
  setupFilesAfterEnv: ['jest-extended'],
  testURL: 'http://localhost',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
};
