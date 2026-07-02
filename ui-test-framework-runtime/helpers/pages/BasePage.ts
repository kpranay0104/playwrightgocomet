import { Locator, Page, expect } from '@playwright/test';
import { logger } from '../utils/logger';

/**
 * BasePage centralizes the low-level Playwright interactions that every
 * page object needs, wrapping them with:
 *   - logging, so a failing CI run tells you exactly which UI action failed
 *   - explicit waits, so tests don't rely on Playwright's default timeouts
 *     alone and give clearer failure messages
 *   - a single spot for error handling / retries if a flaky selector
 *     needs a defensive tweak later
 *
 * Every concrete page object (LoginPage, DashboardPage, ...) extends this.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path = '/'): Promise<void> {
    logger.step(`Navigating to ${path}`);
    try {
      await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    } catch (error) {
      logger.error(`Navigation to ${path} failed`, error);
      throw error;
    }
  }

  protected async click(locator: Locator, description: string): Promise<void> {
    logger.step(`Clicking: ${description}`);
    try {
      await locator.waitFor({ state: 'visible' });
      await locator.click();
    } catch (error) {
      logger.error(`Failed to click: ${description}`, error);
      throw error;
    }
  }

  protected async fill(locator: Locator, value: string, description: string): Promise<void> {
    // Never log raw values for fields that might be passwords.
    const isSensitive = /password/i.test(description);
    logger.step(`Filling: ${description}`, isSensitive ? '******' : value);
    try {
      await locator.waitFor({ state: 'visible' });
      await locator.fill(value);
    } catch (error) {
      logger.error(`Failed to fill: ${description}`, error);
      throw error;
    }
  }

  protected async waitForVisible(locator: Locator, description: string, timeout = 10_000): Promise<void> {
    logger.step(`Waiting for visible: ${description}`);
    try {
      await locator.waitFor({ state: 'visible', timeout });
    } catch (error) {
      logger.error(`Timed out waiting for: ${description}`, error);
      throw error;
    }
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async assertUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }
}
