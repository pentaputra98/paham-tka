import { defineConfig } from '@playwright/test';

/**
 * Uji e2e pada build produksi (vite preview dengan header produksi).
 * Memakai Chrome yang terpasang di sistem (channel 'chrome') agar tidak mengunduh peramban.
 */
export default defineConfig({
  testDir: 'tests',
  testMatch: ['e2e/**/*.spec.ts', 'visual/**/*.spec.ts'],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:4173/',
    channel: 'chrome',
    viewport: { width: 1280, height: 720 },
    locale: 'id-ID',
    serviceWorkers: 'allow',
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173/',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
