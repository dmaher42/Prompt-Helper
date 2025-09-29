import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import security from 'eslint-plugin-security';

export default [
  {
    ignores: ['dist/**']
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      security
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'security/detect-object-injection': 'off'
    }
  }
];
