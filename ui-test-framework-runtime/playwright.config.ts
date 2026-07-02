import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'step-definitions/**/*.ts',
  decorators: {
    tags: {
      '@serial': 'test.describe.configure({ mode: "serial" })',
    },
  },
});

export default defineConfig({
  testDir,
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 120_000,
  expect: {
    timeout: 60_000,
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report-bdd', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http//dummy',
    viewport: { width: 1920, height: 1080 },
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },
    video: {
      mode: 'retain-on-failure',
      size: { width: 1920, height: 1080 },
    },
    trace: 'retain-on-failure',
    actionTimeout: 30_000,
    navigationTimeout: 30_000,
    launchOptions: {
      args: ['--start-maximized', '--window-size=1920,1080'],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
