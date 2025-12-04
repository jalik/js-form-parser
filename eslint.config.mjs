/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import eslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    ignores: [
      '.idea/**',
      'node_modules/**',
      'cjs/**',
      'esm/**',
      'coverage/**',
      'test/**',
      '*.config.ts'
    ]
  },

  // Base JS recommended rules
  eslint.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        ecmaVersion: 'latest',
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
])
