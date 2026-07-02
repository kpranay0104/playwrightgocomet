import { test as base, Page } from '@playwright/test';

/**
 * By default Playwright creates a brand-new BrowserContext (and therefore a
 * new visible window in headed mode) for every single test — this is
 * intentional test isolation, so state from one test never leaks into the
 * next.
 *
 * Some workflows (demoing a suite, watching a long scenario play out end to
 * end, debugging a flow that's naturally sequential) want the opposite:
 * ONE browser window, opened once, reused for every test in the file/worker.
 *
 * This fixture does that by scoping `page` to the WORKER instead of the
 * TEST. Import `test` from this file instead of '@playwright/test' in any
 * spec where you want that behavior.
 *
 * Trade-off: tests sharing a page are no longer isolated from each other —
 * cookies, localStorage, and login state persist between tests in the same
 * file. Order matters, and tests must run serially (see
 * `test.describe.configure({ mode: 'serial' })` in the spec file).
 */
export const test = base.extend<{}, { sharedPage: Page }>({
  sharedPage: [
    async ({ browser }, use) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await use(page);
      await context.close();
    },
    { scope: 'worker' },
  ],
});

export { expect } from '@playwright/test';
