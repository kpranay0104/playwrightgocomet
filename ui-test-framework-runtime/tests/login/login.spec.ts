import { test, expect } from '@playwright/test';
import { LoginPage } from '../../framework/pages/LoginPage';
import { DashboardPage } from '../../framework/pages/DashboardPage';
import { config } from '../../framework/utils/config';
import { logger } from '../../framework/utils/logger';

test.describe('Login workflow', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('valid credentials log the user in and load the dashboard @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.login(config.validUser.username, config.validUser.password);

    await dashboardPage.assertLoadedSuccessfully();
    logger.info('Valid login test passed: dashboard loaded successfully');
  });

  test('invalid credentials show an error and keep the user on the login page @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(config.invalidUser.username, config.invalidUser.password);

    const errorText = await loginPage.getErrorMessage();
    expect(errorText.toLowerCase()).toContain('invalid');

    // User should not have been navigated away from the login flow.
    await loginPage.assertUrlContains('login');
    logger.info('Invalid login test passed: error message displayed, user stayed on login page');
  });

  test('empty credentials are rejected client-side', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginButton.click();

    // OrangeHRM shows "Required" validation text under each empty field.
    await expect(page.getByText('Required').first()).toBeVisible();
  });
});
