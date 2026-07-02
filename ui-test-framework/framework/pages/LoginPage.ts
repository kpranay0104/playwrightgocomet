import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

/**
 * Page object for the OrangeHRM demo login page.
 * Selectors target the OrangeHRM (opensource-demo.orangehrmlive.com) OXD UI.
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
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    // OrangeHRM renders invalid-credential errors in an alert banner.
    this.errorMessage = page.locator('.oxd-alert-content-text');
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
