const base = require('../../packages/config/eslint/base.cjs');

module.exports = {
  ...base,
  root: true,
  extends: ['next/core-web-vitals']
};
