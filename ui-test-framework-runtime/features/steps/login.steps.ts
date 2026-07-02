import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { config } from '../../framework/utils/config';
import { logger } from '../../framework/utils/logger';

const { Given, When, Then } = createBdd(test);

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.open();
});

When('I log in with valid credentials', async ({ loginPage }) => {
  await loginPage.login(config.validUser.username, config.validUser.password);
});

When('I log in with invalid credentials', async ({ loginPage }) => {
  await loginPage.login(config.invalidUser.username, config.invalidUser.password);
});

When('I submit the login form without entering anything', async ({ loginPage }) => {
  await loginPage.loginButton.click();
});

Then('I should see the dashboard', async ({ dashboardPage }) => {
  await dashboardPage.assertLoadedSuccessfully();
  logger.info('BDD step passed: dashboard loaded');
});

Then('I should see an {string} error message', async ({ loginPage }, expectedFragment: string) => {
  const errorText = await loginPage.getErrorMessage();
  if (!errorText.toLowerCase().includes(expectedFragment.toLowerCase())) {
    throw new Error(`Expected error message to contain "${expectedFragment}", got "${errorText}"`);
  }
});

Then('I should still be on the login page', async ({ loginPage }) => {
  await loginPage.assertUrlContains('login');
});

Then('I should see a required field validation message', async ({ page }) => {
  await page.getByText('Required').first().waitFor({ state: 'visible' });
});
