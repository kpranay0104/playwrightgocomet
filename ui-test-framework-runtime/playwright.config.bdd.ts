import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * Separate config for the Gherkin/BDD suite (features/*.feature +
 * features/steps/*.ts), kept apart from playwright.config.ts so the
 * existing plain-Playwright specs in tests/ are completely unaffected.
 *
 * playwright-bdd compiles .feature files + step definitions into real
 * Playwright test files under a generated directory (returned by
 * defineBddConfig as `testDir`) — everything downstream (reporters,
 * retries, projects) is standard Playwright.
 *
 * `@serial` decorator: login.feature and search.feature are each tagged
 * @serial. This maps to `test.describe.configure({ mode: 'serial' })` on
 * their generated files, so playwright (a) runs each file's scenarios in
 * the order they're written instead of an arbitrary order, and (b) skips
 * the remaining scenarios in that file if an earlier one fails.
 */
const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'features/steps/**/*.ts',
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

  // The whole point of this suite is ONE continuous session (one browser,
  // one login) shared across login.feature and search.feature via the
  // worker-scoped `sharedPage` fixture in features/steps/fixtures.ts. That
  // only holds together if every scenario, in every feature file, runs in
  // the same worker, in file order — so, unlike the plain-spec suite, this
  // config deliberately does NOT parallelize and does NOT retry (retrying
  // a single scenario mid-journey would leave the shared page in an
  // inconsistent state).
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
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
