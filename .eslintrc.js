module.exports = {
  parser: '@babel/eslint-parser',
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    commonjs: true,
    es6: true,
    node: true,
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    requireConfigFile: false,
    experimentalObjectRestSpread: true,
    sourceType: 'module',
    ecmaFeatures: {
      globalReturn: false,
      jsx: true,
    },
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jest/all',
    'prettier',
  ],
  plugins: ['jsx-a11y', 'react-hooks', 'import', 'jest', 'prettier'],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: [2, 'single', { avoidEscape: true }],
    'jsx-quotes': [2, 'prefer-double'],
    semi: ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-plusplus': 'off',
    'no-unused-vars': 'error',
    'import/no-named-as-default': 0,
    'import/no-unresolved': [
      'error',
      {
        ignore: ['^@alextim'],
      },
    ],
    'prettier/prettier': 'error',
    'react/function-component-definition': 0,
    'react/prop-types': 0,
    'jest/prefer-expect-assertions': [
      'warn',
      {
        onlyFunctionsWithAsyncKeyword: true,
        onlyFunctionsWithExpectInLoop: true,
        onlyFunctionsWithExpectInCallback: true,
      },
    ],
  },
  ignorePatterns: [
    '**/node_modules/**',
    '**/.cache/**',
    '**/.husky/**',
    '**/.next/**',
    '**/.tmp/**',
    '**/build/**',
    '**/database/**',
    '**/public/**',
    '**/dist/**',
  ],
};
