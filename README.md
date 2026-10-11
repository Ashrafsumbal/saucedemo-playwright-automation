# SauceDemo end-to-end purchase test (Playwright)

## Prerequisites
- Node.js 18 or later (Node.js 20+ recommended)
- Internet access to `https://www.saucedemo.com/`

## Install
From this directory, run:

```bash
npm install
npx playwright install chromium
```

## Run
Headless (default):

```bash
npm test
```

Visible browser:

```bash
npm run test:headed
```

Open Playwright's UI runner:

```bash
npm run test:ui
```

Show the HTML report after a run:

```bash
npm run report
```

## Test account
By default the test uses SauceDemo's public demo account `standard_user` / `secret_sauce`. To override credentials, set `SAUCEDEMO_USERNAME` and `SAUCEDEMO_PASSWORD` in your shell before running the test.

## Notes
- The test is intentionally a single end-to-end scenario using a fresh browser context per test.
- Playwright's locator auto-waiting and web-first assertions are used; no fixed sleeps are included.
- Screenshots, video, and trace are retained on failure according to the config. Artifacts are stored in Playwright's output folders.
- This targets the public demo site; the site, test data, or copy may change and cause failures unrelated to your code.
