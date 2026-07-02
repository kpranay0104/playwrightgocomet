import { test as base } from 'playwright-bdd';
import { Page } from '@playwright/test';
import { LoginPage } from '../../framework/pages/LoginPage';
import { DashboardPage } from '../../framework/pages/DashboardPage';

/**
 * Extends playwright-bdd's base test with the SAME page objects the
 * plain (non-BDD) specs in tests/ use. Step definitions consume these
 * fixtures instead of talking to selectors directly — the Gherkin layer
 * is just a different way of expressing intent on top of the same
 * reusable framework, not a separate implementation.
 *
 * ONE BROWSER, ONE LOGIN
 * -----------------------
 * Playwright's default `page` fixture is scoped to each individual test
 * (scenario), so out of the box every Scenario in a .feature file would
 * get its own fresh browser context — no shared cookies/session, and no
 * way to run "check failures, then log in once, then search" as a single
 * journey.
 *
 * To get one continuous session across every scenario in a feature file,
 * this fixture:
 *   1. Opens a single BrowserContext/Page ONCE per worker (`sharedPage`,
 *      scope: 'worker'). The underlying `browser` fixture is already
 *      worker-scoped in Playwright, so this also guarantees only one
 *      browser process is launched for the whole run.
 *   2. Overrides the built-in `page` fixture to just return that same
 *      `sharedPage` for every scenario. Any step (or page object) that
 *      asks for `page` transparently gets the one shared page/session.
 *
 * This only produces a true single continuous session if the scenarios
 * that depend on it run in the same worker, in file order, without being
 * split across parallel workers. That's enforced in
 * playwright.config.bdd.ts (`workers: 1`, `fullyParallel: false`) and by
 * the `@serial` tag on each Feature (login.feature, search.feature).
 */
export const test = base.extend<
  { loginPage: LoginPage; dashboardPage: DashboardPage },
  { sharedPage: Page }
>({
  sharedPage: [
    async ({ browser }, use) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await use(page);
      await context.close();
    },
    { scope: 'worker' },
  ],

  // Every scenario's `page` fixture now resolves to the one worker-scoped
  // sharedPage above, instead of Playwright's default per-test page.
  page: async ({ sharedPage }, use) => {
    await use(sharedPage);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
