import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

/** Flat config: eslint-config-next 16 экспортирует готовые массивы правил. */
const config = [
  {
    ignores: ['.next/**', 'node_modules/**', '.legacy/**', 'next-env.d.ts']
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
];

export default config;
