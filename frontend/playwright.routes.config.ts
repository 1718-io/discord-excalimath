import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'routes.spec.ts',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { outputFolder: 'playwright-route-report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4178',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'pnpm -C ../backend dev',
      url: 'http://127.0.0.1:8081/health',
      env: { HOST: '127.0.0.1', PORT: '8081' },
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'pnpm dev --host 127.0.0.1 --port 4178 --strictPort',
      url: 'http://127.0.0.1:4178',
      env: { VITE_ROOM_SERVER_URL: 'ws://127.0.0.1:8081' },
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
