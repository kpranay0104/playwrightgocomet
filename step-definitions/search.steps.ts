import { createBdd } from 'playwright-bdd';
import { test, expect } from './fixtures';
import { logger } from '../helpers/utils/logger';

const { When, Then } = createBdd(test);

When('I search for the employee {string}', async ({ dashboardPage }, term: string) => {
  await dashboardPage.searchEmployee(term);
});

Then('I should see at least one search result', async ({ dashboardPage }) => {
  await dashboardPage.getResultsCount();
});
