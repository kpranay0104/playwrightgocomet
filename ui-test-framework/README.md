# UI Test Automation Framework

Reusable Playwright + TypeScript UI automation framework and test suite for
a login and search workflow, with CI/CD via GitHub Actions.

Target app (default): [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/)
Publicly published demo credentials: `Admin` / `admin123`.

## Repository structure

```
tests/          Test cases, organized by feature
  login/        Valid login, invalid login, empty-form validation
  search/       Optional: employee search → verify results
framework/      Reusable automation code
  pages/        Page Object Model classes (BasePage, LoginPage, DashboardPage)
  utils/        Logger and environment/config helpers
ci/             CI/CD documentation (the runnable workflow lives in .github/workflows)
docs/           Architecture and setup documentation
.github/
  workflows/    GitHub Actions pipeline (ci.yml)
```

## Quick start

```bash
npm install
npx playwright install --with-deps chromium firefox
npm test
```

Open the HTML report after a run:

```bash
npm run report
```

Full setup, environment overrides, and troubleshooting: [`docs/SETUP.md`](docs/SETUP.md).
How the framework is designed and why: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
CI/CD pipeline details: [`ci/README.md`](ci/README.md).

## Test cases implemented

| Test | File | What it verifies |
|---|---|---|
| Valid login | `tests/login/login.spec.ts` | Correct credentials → dashboard loads, URL contains `dashboard` |
| Invalid login | `tests/login/login.spec.ts` | Wrong credentials → error banner shown, user stays on login page |
| Empty form | `tests/login/login.spec.ts` | Empty submit → client-side "Required" validation shown |
| Search (optional) | `tests/search/search.spec.ts` | Logs in, searches the employee list, verifies at least one result row appears |

## Example: writing a new test

Because selectors and waits live in page objects, a new test is just intent:

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../framework/pages/LoginPage';
import { DashboardPage } from '../../framework/pages/DashboardPage';
import { config } from '../../framework/utils/config';

test('logged-in user sees their username in the header', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(config.validUser.username, config.validUser.password);

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.assertLoadedSuccessfully();
  await expect(dashboardPage.userDropdown).toBeVisible();
});
```

## Example: adding a page object for a new screen

```ts
// framework/pages/EmployeeProfilePage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class EmployeeProfilePage extends BasePage {
  readonly fullNameHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.fullNameHeading = page.locator('.employee-name');
  }

  async assertProfileLoaded(): Promise<void> {
    await this.waitForVisible(this.fullNameHeading, 'Employee name heading');
  }
}
```

## CI/CD

Every push and pull request to `main` triggers `.github/workflows/ci.yml`,
which installs dependencies, runs the full suite headlessly across Chromium
and Firefox, and publishes both an HTML report and JUnit results as
downloadable artifacts (plus an inline Actions test summary). See
[`ci/README.md`](ci/README.md) for required secrets/variables and how to
extend the pipeline.

## Design choices

- **Playwright over Selenium/Cypress**: built-in test runner, parallelism,
  retries, and HTML/JUnit reporting with no extra libraries — directly
  satisfies the "reporting" and "CI test reports" requirements with less
  glue code. See `docs/ARCHITECTURE.md` for the tradeoffs.
- **Page Object Model**: one class per screen/widget in `framework/pages/`,
  so a markup change only requires updating one file, not every test.
- **Env-driven config**: `BASE_URL` and credentials are overridable via
  environment variables/CI secrets, so the same code can target a different
  demo site or a real staging environment without code changes.
