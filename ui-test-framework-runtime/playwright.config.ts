import { defineConfig, devices } from '@playwright/test';

/**
 * Central Playwright configuration.
 * BASE_URL can be overridden via environment variable so the same suite
 * can target different demo apps (OrangeHRM, the-internet, etc.) without
 * code changes.
 */
const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  // Multiple reporters: human-readable list in the console, HTML report for
  // local/browsable results, and JUnit XML for CI systems (GitHub Actions
  // test summary, Jenkins, etc.) to consume.
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
