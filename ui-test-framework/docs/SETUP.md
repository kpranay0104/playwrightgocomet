# Setup Guide

## Prerequisites

- Node.js 18+ (Node 20 recommended, matches CI)
- npm 9+

## Install

```bash
git clone <your-repo-url>
cd ui-test-framework
npm install
npx playwright install --with-deps chromium firefox
```

## Run tests

```bash
# Everything
npm test

# Just login tests
npm run test:login

# Just the optional search test
npm run test:search

# Watch the browser while it runs (useful when writing new tests)
npm run test:headed

# Step-through debugger + Playwright Inspector
npm run test:debug

# Open the last HTML report
npm run report
```

## Point tests at a different environment

All config is environment-variable driven (see `framework/utils/config.ts`):

```bash
BASE_URL=https://the-internet.herokuapp.com \
VALID_USERNAME=tomsmith \
VALID_PASSWORD=SuperSecretPassword! \
npm test
```

Note: if you switch to a different demo app, you'll also need a matching
page object (selectors differ per app) — see `docs/ARCHITECTURE.md` for how
to add one. The shipped `LoginPage`/`DashboardPage` target the OrangeHRM
demo's markup specifically.

## Troubleshooting

**`browserType.launch: Executable doesn't exist`**
Run `npx playwright install --with-deps chromium firefox` — browser binaries
are not installed by `npm install` alone.

**Tests fail with a timeout on a fresh clone**
The public OrangeHRM demo instance is occasionally slow or reset by the
vendor. Re-run with `--retries=2`, or confirm the site is reachable in a
normal browser first.

**Selectors stopped matching**
The OrangeHRM demo UI is updated periodically by the vendor. Selectors live
entirely in `framework/pages/*.ts` — update them there; no test file changes
needed.

**CI is green, locally is red (or vice versa)**
Check `BASE_URL`/credential secrets are set the same way in both places (see
`ci/README.md`), and diff `playwright.config.ts`'s `retries`/`workers`
settings — CI uses different values intentionally (see
`docs/ARCHITECTURE.md`).
