import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  optimizeDeps: {
    include: ['mithril'],
  },
  test: {
    globals: true,
    setupFiles: ['./src/testing/setup.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
})
