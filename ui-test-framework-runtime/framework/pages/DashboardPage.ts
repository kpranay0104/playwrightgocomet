import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

/**
 * Page object for the OrangeHRM dashboard (landing page after a
 * successful login) plus the employee-search widget used by the
 * optional "search" test case.
 */
export class DashboardPage extends BasePage {
  readonly dashboardHeader: Locator;
  readonly userDropdown: Locator;
  readonly sidebarSearchInput: Locator; // PIM "Employee List" search box
  readonly employeeListResults: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeader = page.locator('h6', { hasText: 'Dashboard' });
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.sidebarSearchInput = page.locator('input[placeholder="Type for hints..."]').first();
    this.employeeListResults = page.locator('.oxd-table-card');
  }

  async assertLoadedSuccessfully(): Promise<void> {
    logger.step('Verifying dashboard loaded');
    await this.waitForVisible(this.dashboardHeader, 'Dashboard header');
    await this.assertUrlContains('dashboard');
    await expect(this.dashboardHeader).toBeVisible();
  }

  /**
   * Searches the employee list widget (PIM module) — used as the
   * "optional search functionality" scenario. Navigates to PIM first
   * since the search widget lives there, not on the dashboard itself.
   */
  async searchEmployee(term: string): Promise<void> {
    await this.page.waitForTimeout(10000);
    logger.info(`Searching for employee: "${term}"`);

    const searchInput = this.page.getByPlaceholder('Search');

    await searchInput.click();
    await searchInput.fill(term);

    await this.page.keyboard.press('Enter');

    await this.page.locator('button:has-text("Search")').click();
    await this.page.waitForTimeout(10000);
  }

  async getResultsCount(): Promise<number> {
    return this.employeeListResults.count();
  }
}
