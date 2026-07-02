import { createBdd } from 'playwright-bdd';
import { test, expect } from './fixtures';
import { logger } from '../../framework/utils/logger';

const { When, Then } = createBdd(test);

When('I search for the employee {string}', async ({ dashboardPage }, term: string) => {
  await dashboardPage.searchEmployee(term);
});

Then('I should see at least one search result', async ({ dashboardPage }) => {
  const count = await dashboardPage.getResultsCount();
  logger.info(`BDD step: search returned ${count} result(s)`);
  expect(count).toBeGreaterThan(0);
});
