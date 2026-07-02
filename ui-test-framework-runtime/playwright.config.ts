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

const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

export default defineConfig({
  testDir,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 1,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report-bdd', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit-results-bdd.xml' }],
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});