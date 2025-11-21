/*
 * The MIT License (MIT)
 * Copyright (c) 2025 Karl STEIN
 */

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3000',
      },
    },
  },
})
