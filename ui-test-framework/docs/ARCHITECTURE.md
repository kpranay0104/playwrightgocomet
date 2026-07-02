# Architecture

## Layers

```
tests/         Test specs — what to verify. No selectors, no waits, no raw
                Playwright calls. Reads like a checklist.
framework/      How to interact with the app.
  pages/        Page Object Model classes — one class per screen/widget.
  utils/        Cross-cutting concerns: logging, config/env handling.
```

This separation means:

- If OrangeHRM changes a CSS class or field name, you fix it in **one**
  page object, not in every test that touches that field.
- Tests describe intent ("login with invalid credentials should show an
  error"), not mechanics ("fill selector X, click selector Y").
- Adding a new app under test (e.g. `the-internet.herokuapp.com/login`) means
  adding new page objects, not rewriting the test runner or CI config.

## Page Object Model

- `BasePage` — shared primitives every page object needs: logged `click`,
  `fill`, `waitForVisible`, plus `goto` and `assertUrlContains`. Password
  fields are automatically masked in logs (see `BasePage.fill`).
- `LoginPage` — login form for the OrangeHRM demo.
- `DashboardPage` — post-login landing page, plus the employee-search widget
  used by the optional search test.

Each page object only knows about *its own* screen. `DashboardPage` doesn't
know how login works, and `LoginPage` doesn't know what a successful login
looks like — that assertion lives in the test, using `DashboardPage`.

## Why Playwright

- Built-in test runner with parallelism, retries, and multiple reporters
  (HTML, JUnit, list) out of the box — no extra reporting library needed.
- Auto-waiting reduces flaky `sleep()`-based tests.
- First-class trace/video/screenshot capture on failure, which is what
  actually makes CI failures debuggable without re-running locally.
- Single TypeScript codebase; easy to extend to API testing later using the
  same `@playwright/test` runner if needed.

(Selenium or Cypress would satisfy the same requirements; Playwright was
chosen here for the batteries-included reporting and CI story. Swapping
frameworks would mean rewriting `framework/pages/*` and `playwright.config.ts`
— the `tests/*` intent and repo layout would stay the same.)

## Logging

`framework/utils/logger.ts` is a small dependency-free wrapper around
`console.log` with levels (`INFO`, `WARN`, `ERROR`, `DEBUG`, `STEP`) and
timestamps. Every page-object action logs a `STEP` line, so a CI failure's
console output reads as a narrative of what the browser was doing right up
to the failure, e.g.:

```
[2026-07-02T10:03:11.021Z] [STEP] Navigating to /web/index.php/auth/login
[2026-07-02T10:03:11.900Z] [STEP] Filling: Username field Admin
[2026-07-02T10:03:12.010Z] [STEP] Filling: Password field ******
[2026-07-02T10:03:12.150Z] [STEP] Clicking: Login button
[2026-07-02T10:03:13.400Z] [ERROR] Timed out waiting for: Dashboard header
```

## Error handling

- Every `BasePage` interaction is wrapped in try/catch that logs an `ERROR`
  with context before re-throwing, so Playwright's own failure (with
  screenshot/trace) is preceded by a human-readable reason in the log.
- `playwright.config.ts` sets `retries: 2` in CI to absorb transient network
  flakiness against a shared public demo server, while keeping `retries: 0`
  locally so failures are immediately visible during development.

## Configuration

`framework/utils/config.ts` reads `BASE_URL` and credentials from
environment variables with sane defaults for the public OrangeHRM demo. This
lets the exact same test/framework code run against a different environment
(staging, a different demo site) purely through CI secrets/variables — see
`ci/README.md`.
