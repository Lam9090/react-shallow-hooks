module.exports = {
  env: {
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['@typescript-eslint', 'prettier', 'react'],
  extends: ['plugin:react/recommended', 'plugin:import/typescript', 'prettier', 'prettier/react'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
      },
    },
  ],
  rules: {
    'react/prop-types': 0,
    'react/jsx-filename-extension': 0,
    'no-param-reassign': 0,
    'no-void': 0,
    'no-nested-ternary': 0,
    'react/jsx-props-no-spreading': 0,
    'jsx-a11y/anchor-has-content': 0,
    'no-multi-assign': 0,
    'import/no-extraneous-dependencies': 0,
    "prettier/prettier": "error"
  },
};
