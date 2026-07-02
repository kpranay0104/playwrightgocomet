import { test, expect } from '../../framework/utils/sharedPageFixture';
import { LoginPage } from '../../framework/pages/LoginPage';
import { DashboardPage } from '../../framework/pages/DashboardPage';
import { config } from '../../framework/utils/config';
import { logger } from '../../framework/utils/logger';

/**
 * Same login + search coverage as tests/login/login.spec.ts and
 * tests/search/search.spec.ts, but run as ONE continuous session in a
 * single browser window instead of a fresh window per test.
 *
 * Use this style when you want to watch (or demo) the whole workflow play
 * out end to end. For everyday CI runs, prefer the isolated specs — this
 * pattern trades test independence for a single visible session.
 *
 * `mode: 'serial'` is required: since all tests share one page, they MUST
 * run in order, and if one fails, Playwright skips the rest rather than
 * continuing on a page left in a broken/unknown state.
 */
test.describe.configure({ mode: 'serial' });

test.describe('Full workflow in a single browser session', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeAll(async ({ sharedPage }) => {
    loginPage = new LoginPage(sharedPage);
    dashboardPage = new DashboardPage(sharedPage);
  });

  test('step 1: open login page', async ({ sharedPage }) => {
    await loginPage.open();
    await expect(sharedPage).toHaveURL(/login/);
  });

  test('step 2: invalid credentials show an error', async () => {
    await loginPage.login(config.invalidUser.username, config.invalidUser.password);
    const errorText = await loginPage.getErrorMessage();
    expect(errorText.toLowerCase()).toContain('invalid');
    logger.info('Invalid login step passed within shared session');
  });

  test('step 3: valid credentials load the dashboard', async () => {
    // Same page, same window — no new browser opened. Re-fill the form
    // over the previous failed attempt.
    await loginPage.login(config.validUser.username, config.validUser.password);
    await dashboardPage.assertLoadedSuccessfully();
    logger.info('Valid login step passed within shared session');
  });

  test('step 4: search returns results', async () => {
    await dashboardPage.searchEmployee(config.validUser.username);
    const count = await dashboardPage.getResultsCount();
    expect(count).toBeGreaterThan(0);
    logger.info(`Search step passed within shared session, ${count} result(s)`);
  });
});
