# CI/CD Pipeline

The actual, executable GitHub Actions workflow lives at:

```
.github/workflows/ci.yml
```

GitHub only discovers workflows placed under `.github/workflows/`, so that is
the canonical location. This `ci/` folder documents what the pipeline does
and how to configure it, and is where you'd add pipeline configs for other
CI systems (Jenkins, GitLab CI, CircleCI, Azure Pipelines) if you migrate off
GitHub Actions later.

## What the pipeline does

Trigger: every push to `main`, every pull request targeting `main`, and
manual runs via `workflow_dispatch`.

1. **Checkout repo** — `actions/checkout@v4`
2. **Set up Node.js 20** with npm cache enabled for faster installs
3. **Install dependencies** — `npm ci` (uses the committed `package-lock.json`
   for reproducible installs)
4. **Install Playwright browsers** — `npx playwright install --with-deps
   chromium firefox`
5. **Run UI tests** — `npx playwright test` (runs every spec in `tests/`
   across the `chromium` and `firefox` projects defined in
   `playwright.config.ts`)
6. **Publish reports** (runs even if tests fail, via `if: always()`):
   - HTML report → uploaded as the `playwright-html-report` artifact
   - JUnit XML → uploaded as the `junit-results` artifact, and also rendered
     as an inline PR/Actions check summary via `dorny/test-reporter`

## Required repository configuration

The workflow reads credentials from GitHub Secrets/Variables instead of
hardcoding them, so you can point the same pipeline at a different
environment without editing code:

| Setting            | Type      | Purpose                                   | Default if unset                              |
|---------------------|-----------|--------------------------------------------|------------------------------------------------|
| `BASE_URL`          | Variable  | App under test                            | `https://opensource-demo.orangehrmlive.com`     |
| `VALID_USERNAME`    | Secret    | Username for the "valid login" test case  | falls back to framework default (`Admin`)       |
| `VALID_PASSWORD`    | Secret    | Password for the "valid login" test case  | falls back to framework default (`admin123`)    |
| `INVALID_USERNAME`  | Secret    | Username for the "invalid login" test     | falls back to framework default                 |
| `INVALID_PASSWORD`  | Secret    | Password for the "invalid login" test     | falls back to framework default                 |

Set these under **Settings → Secrets and variables → Actions** in the GitHub
repo. For the public OrangeHRM demo the defaults already work, so no setup
is strictly required to get the pipeline green.

## Viewing results

- **Actions tab → workflow run → Summary**: inline pass/fail breakdown from
  the JUnit report.
- **Artifacts**: download `playwright-html-report`, unzip, and open
  `index.html` for full trace viewer, screenshots, and video of any
  failures (traces/video/screenshots are captured automatically
  `on-first-retry` / `only-on-failure` per `playwright.config.ts`).

## Extending the pipeline

- Add a matrix (`strategy.matrix`) over `project: [chromium, firefox]` if you
  want parallel jobs instead of one job running both projects sequentially.
- Add a `deploy-report` job that publishes `playwright-report/` to GitHub
  Pages if you want a persistently browsable report instead of a downloaded
  artifact.
- Add branch protection requiring the `ui-tests` check to pass before merge.
