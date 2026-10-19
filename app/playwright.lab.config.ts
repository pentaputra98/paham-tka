import { defineConfig } from '@playwright/test';

/** Uji kelayakan gerak di lab (server dev, halaman lab/motion.html tidak ikut build). */
export default defineConfig({
  testDir: 'tests/lab',
  workers: 1,
  reporter: [['list']],
  timeout: 120_000,
  use: { baseURL: 'http://localhost:5173/', channel: 'chrome', viewport: { width: 1280, height: 720 } },
  webServer: { command: 'npm run dev', url: 'http://localhost:5173/', reuseExistingServer: true, timeout: 60_000 },
});
