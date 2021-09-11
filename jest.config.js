const base = require('./jest.config.base');

module.exports = {
  ...base,
  roots: ['<rootDir>'],
  projects: [
    '<rootDir>/packages/mockingbird',
    '<rootDir>/packages/reflect',
    '<rootDir>/packages/parser',
    '<rootDir>/packages/logger',
    '<rootDir>/packages/fixtures',
  ],
};
