/*
Author: Vitest
Date Accessed: 11 October 2026
Link: https://vitest.dev/config/
Reason: Used to configure Vitest with the jsdom environment, globals and the test setup file.
*/

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],
    clearMocks: true,
    restoreMocks: true,
    css: false
  }
});
