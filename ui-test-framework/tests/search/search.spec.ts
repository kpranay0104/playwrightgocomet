import { test, expect } from '@playwright/test';
import { LoginPage } from '../../framework/pages/LoginPage';
import { DashboardPage } from '../../framework/pages/DashboardPage';
import { config } from '../../framework/utils/config';
import { logger } from '../../framework/utils/logger';

/**
 * Optional scenario per the requirements: search functionality → verify
 * results appear. Uses the PIM "Employee List" search widget, which is the
 * closest equivalent to a generic "search" feature on the OrangeHRM demo.
 */
test.describe('Search workflow', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(config.validUser.username, config.validUser.password);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoadedSuccessfully();
  });

  test('searching for the default admin employee returns results @regression', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.searchEmployee(config.validUser.username);

    const count = await dashboardPage.getResultsCount();
    logger.info(`Search returned ${count} result row(s)`);
    expect(count).toBeGreaterThan(0);
  });
});
