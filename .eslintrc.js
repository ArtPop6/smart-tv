
module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    commonjs: true
  },
  extends: 'standard',
  plugins: ['html'],
  parser: 'babel-eslint',
  parserOptions: { sourceType: 'module' },
  settings: {
    'import/resolver': {
      'webpack': { 'config': 'build/webpack.base.conf.js' }
    }
  },
  globals: {
  },
  rules: {
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': true
    }],
    'no-param-reassign': 'off',
  },
};
