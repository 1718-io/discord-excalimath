import { defineConfig } from '@playwright/test';

const viewportMatrix = [
  { name: 'large-desktop', width: 1920, height: 1080 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'widescreen', width: 1536, height: 864 },
  { name: 'laptop', width: 1280, height: 720 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'tablet-portrait', width: 768, height: 1024 },
  { name: 'small-tablet', width: 820, height: 1180 },
  { name: 'compact-laptop-panel', width: 720, height: 900 },
  { name: 'medium-compact-panel', width: 600, height: 900 },
  { name: 'compact-panel', width: 480, height: 720 },
  { name: 'large-phone', width: 414, height: 896 },
  { name: 'modern-phone', width: 390, height: 844 },
  { name: 'narrow-panel', width: 360, height: 640 },
  { name: 'regular-phone', width: 375, height: 667 },
  { name: 'small-phone', width: 320, height: 568 },
  { name: 'utility-compact', width: 280, height: 480 },
  { name: 'sidebar-stress', width: 240, height: 360 },
];

export default defineConfig({
  testDir: './tests',
  testMatch: 'responsive.spec.ts',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:6006',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
  },
  projects: viewportMatrix.map(({ name, width, height }) => ({
    name,
    use: {
      browserName: 'chromium' as const,
      viewport: { width, height },
    },
  })),
  webServer: {
    command: 'pnpm storybook --ci --host 127.0.0.1 --port 6006',
    url: 'http://127.0.0.1:6006',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
