import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';
import { dashboardPageLocators as locators } from '../locators/DashboardPage.locators';

/**
 * Page object for the OrangeHRM dashboard (landing page after a
 * successful login) plus the employee-search widget used by the
 * optional "search" test case. Selectors live in
 * helpers/locators/DashboardPage.locators.ts.
 */
export class DashboardPage extends BasePage {
  readonly dashboardHeader: Locator;
  readonly userDropdown: Locator;
  readonly sidebarSearchInput: Locator; // PIM "Employee List" search box
  readonly employeeListResults: Locator;
  readonly employeeSearchInput: Locator;
  readonly employeeSearchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeader = page.locator(locators.dashboardHeader.tag, {
      hasText: locators.dashboardHeader.hasText,
    });
    this.userDropdown = page.locator(locators.userDropdown);
    this.sidebarSearchInput = page.locator(locators.sidebarSearchInput).first();
    this.employeeListResults = page.locator(locators.employeeListResults);
    this.employeeSearchInput = page.getByPlaceholder(locators.employeeSearchInputPlaceholder);
    this.employeeSearchButton = page.locator(`button:has-text("${locators.employeeSearchButtonText}")`);
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

    await this.employeeSearchInput.click();
    await this.employeeSearchInput.fill(term);

    await this.page.keyboard.press('Enter');

    await this.employeeSearchButton.click();
    await this.page.waitForTimeout(10000);
  }

  async getResultsCount(): Promise<number> {
    return this.employeeListResults.count();
  }
}
