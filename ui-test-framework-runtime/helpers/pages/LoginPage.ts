import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';
import { loginPageLocators as locators } from '../locators/LoginPage.locators';

/**
 * Page object for the OrangeHRM demo login page.
 * Selectors live in helpers/locators/LoginPage.locators.ts — this class
 * only holds behavior (what to click/fill/assert), not raw strings.
 *
 * If you point this framework at a different demo (e.g.
 * the-internet.herokuapp.com/login), create a sibling page object
 * (see docs/ARCHITECTURE.md) rather than overloading this one — different
 * apps deserve different page objects even if the workflow looks similar.
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator(locators.usernameInput);
    this.passwordInput = page.locator(locators.passwordInput);
    this.loginButton = page.locator(locators.loginButton);
    this.errorMessage = page.locator(locators.errorMessage);
  }

  async open(): Promise<void> {
    await this.goto('/web/index.php/auth/login');
  }

  async login(username: string, password: string): Promise<void> {
    logger.info(`Attempting login for user "${username}"`);
    await this.fill(this.usernameInput, username, 'Username field');
    await this.fill(this.passwordInput, password, 'Password field');
    await this.click(this.loginButton, 'Login button');
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage, 'Login error message');
    const text = await this.errorMessage.textContent();
    return (text || '').trim();
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return this.loginButton.isVisible();
  }
}
