module.exports = {
  root: true,
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: { project: './tsconfig.json' },
  plugins: ['prettier', 'react', 'jsx-a11y', 'testing-library', 'jest-dom'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/prefer-default-export': 'off',
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'function-declaration',
      },
    ],
    'react/no-array-index-key': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/jsx-props-no-spreading': 'off',
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        controlComponents: ['AutocompletePureTestComponent'],
      },
    ],
  },
};
