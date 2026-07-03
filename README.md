# UI Automation Framework — Login & Search (Playwright BDD)

Reusable Playwright + TypeScript UI automation framework, written in
Gherkin (Given/When/Then) format, covering a login and employee-search
workflow, integrated with GitHub Actions CI/CD.

Target app (default): [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/)

## Repository structure

```
features/            Gherkin scenarios (.feature files)
  login.feature
  search.feature
step-definitions/    Given/When/Then implementations
  fixtures.ts          Wires page objects into steps
  login.steps.ts
  search.steps.ts
helpers/              Reusable automation code
  pages/               Page Object Model classes (BasePage, LoginPage, DashboardPage)
  locators/            Selector definitions per page
  utils/               logger.ts, config.ts (env-driven config)
.github/workflows/    CI pipeline (ci.yml)
playwright.config.ts  BDD + reporting configuration
```

## Prerequisites

- Node.js 20+
- npm

## Install

```bash
npm install
npm run install:browsers
```

## Run the tests

All configuration (target URL and credentials) is read from environment
variables at runtime — nothing sensitive is hardcoded in the repo. Pass
them inline on the command you run:

```bash
BASE_URL=https://opensource-demo.orangehrmlive.com \
VALID_USERNAME=Admin \
VALID_PASSWORD=admin123 \
npm test
```

Other useful variants:

```bash
# Visible browser
BASE_URL=https://opensource-demo.orangehrmlive.com \
VALID_USERNAME=Admin \
VALID_PASSWORD=admin123 \
npm run test:headed

# Step-through debugger
BASE_URL=https://opensource-demo.orangehrmlive.com \
VALID_USERNAME=Admin \
VALID_PASSWORD=admin123 \
npm run test:debug

# View the HTML report after a run
npm run report
```

If you omit these variables, the framework falls back to placeholder
values defined in `helpers/utils/config.ts` and `playwright.config.ts`,
which will not resolve to a real target — always set `BASE_URL`,
`VALID_USERNAME`, and `VALID_PASSWORD` explicitly when running locally.

### All supported environment variables

| Variable | Purpose |
|---|---|
| `BASE_URL` | The application under test |
| `VALID_USERNAME` | Username used in the "valid login" scenario |
| `VALID_PASSWORD` | Password used in the "valid login" scenario |
| `INVALID_USERNAME` | Username used in the "invalid login" scenario |
| `INVALID_PASSWORD` | Password used in the "invalid login" scenario |

## CI/CD

Every push and pull request to `main` triggers `.github/workflows/ci.yml`,
which installs dependencies, generates and runs the BDD suite, and
publishes the HTML report and JSON results as downloadable artifacts.

`BASE_URL` comes from a repository **variable**; the four credential
values come from repository **secrets** (Settings → Secrets and variables
→ Actions). The workflow can also be triggered manually from the Actions
tab (**Run workflow**), where you can optionally override any of these
five values for that one run only — leave a field blank to fall back to
the saved secret/variable.

## Adding a new scenario

1. Add a `Scenario:` to the relevant `.feature` file in `features/`
2. Implement any new step wording in `step-definitions/*.steps.ts`,
   reusing the `loginPage`/`dashboardPage` fixtures rather than raw
   selectors
3. Run `npm test` — it regenerates the compiled test files from your
   `.feature` files automatically before running them
