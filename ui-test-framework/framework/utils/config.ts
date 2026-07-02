/**
 * Central place for environment-driven configuration.
 *
 * Credentials for the public OrangeHRM demo instance are publicly published
 * by the vendor for demo purposes (Admin/admin123). They are still read
 * from environment variables with a fallback so that:
 *   1. Nothing sensitive is hardcoded if you point this framework at a
 *      real/staging environment with real credentials.
 *   2. CI can override them via GitHub Actions secrets without touching code.
 */
export const config = {
  baseUrl: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',

  validUser: {
    username: process.env.VALID_USERNAME || 'Admin',
    password: process.env.VALID_PASSWORD || 'admin123',
  },

  invalidUser: {
    username: process.env.INVALID_USERNAME || 'not_a_real_user',
    password: process.env.INVALID_PASSWORD || 'wrong_password_123',
  },
};
