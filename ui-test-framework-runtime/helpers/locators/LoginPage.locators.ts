/**
 * Raw selectors for the OrangeHRM login page.
 * Kept separate from LoginPage.ts so a UI change only means editing
 * strings here — page-object methods (login, getErrorMessage, ...) never
 * need to change just because a selector changed.
 */
export const loginPageLocators = {
  usernameInput: 'input[name="username"]',
  passwordInput: 'input[name="password"]',
  loginButton: 'button[type="submit"]',
  // OrangeHRM renders invalid-credential errors in an alert banner.
  errorMessage: '.oxd-alert-content-text',
};
