# AutomationExercise – Playwright (TypeScript)

End-to-end UI test automation for [automationexercise.com](https://automationexercise.com/) built with Playwright and the Page Object Model. Tests run locally only, by default on all three browsers (chromium, firefox, webkit).

## Tech stack

- [Playwright Test](https://playwright.dev/) + TypeScript
- Page Object Model with custom fixtures
- `dotenv` for test data, custom file/console logger
- Browsers: Chromium, Firefox, WebKit

## Folder structure

```
pages/        Page Object classes (all locators and page actions)
tests/        Spec files (one per feature) + auth.setup.ts / auth.teardown.ts
fixtures/     Custom test fixture: ad blocking, page objects, logger
utils/        env.ts (typed .env loader), logger.ts, data.ts (helpers)
test-data/    Files used by tests (Contact Us upload)
.auth/        Saved session and setup user data (git-ignored)
logs/         test-run.log (git-ignored)
```

## Setup

```bash
npm install
npx playwright install
cp .env.example .env     # Windows: copy .env.example .env
```

Edit `.env` with your own test data. A missing variable fails fast with a clear error from `utils/env.ts`.

## Running tests

```bash
npm test                  # all tests, all browsers
npm run test:smoke        # @smoke
npm run test:regression   # @regression
npm run test:negative     # @negative
npm run test:headed       # headed mode
npm run report            # open the HTML report

npx playwright test --project=chromium           # one browser only (chromium | firefox | webkit)
npx playwright test --headed --project=firefox   # headed, single browser
npx playwright test tests/cart.spec.ts
npx playwright test --grep "@checkout|@setup"
```

When you filter with `--grep`, include `|@setup` so the setup and teardown tests still run (the npm scripts already do this).

## Tags

| Tag | Meaning |
| --- | --- |
| `@smoke` | Critical happy paths |
| `@regression` | All tests |
| `@negative` | Validation and error cases |
| `@e2e` | Full flows |
| `@register` `@login` `@products` `@cart` `@checkout` `@contact` `@subscription` `@navigation` | Feature tags |
| `@setup` | Auth setup and teardown (internal) |

## Session state, setup and teardown

- The `setup` project runs `tests/auth.setup.ts`: it registers a fresh user (timestamp-based email), logs in through the UI and saves the session to `.auth/user.json`. The generated email is stored in `.auth/user-data.json`.
- Every browser project depends on `setup` and uses `storageState: '.auth/user.json'`, so tests never log in through the UI. Cart, checkout and logged-in header tests start directly on their page.
- `register.spec.ts`, `login.spec.ts` and the guest cart/checkout tests override `storageState` with an empty state to start logged out.
- The `teardown` project (`tests/auth.teardown.ts`) logs in as the setup user and deletes the account, so no test users are left behind. Tests that register their own user delete it at the end.
- The cart is cleared in `beforeEach` for cart and checkout tests so they stay independent.
- Header navigation helpers wait for the page `load` event before returning. The site binds its JS handlers late, and clicking too early (for example Contact Us submit) posts the form natively instead of showing the confirm dialog.
- All tests share one server-side account (and its cart), so the suite runs with a single worker.

## Ad blocking

The site shows Google ads and a vignette popup that can intercept clicks. The custom fixture in `fixtures/index.ts` aborts requests to ad and tracking hosts (googlesyndication, doubleclick, adservice and similar) through `page.route`. All specs import `test` and `expect` from this fixture.

## Test coverage

| Area | Tests |
| --- | --- |
| Register | Register and delete account, duplicate email error |
| Login | Valid login, invalid email, invalid password, logout |
| Products | Products page, product card contents |
| Search | Matching keyword (every result checked), no-result keyword |
| Category and brand | Women, Men and Kids sub-categories, brand filter |
| Product detail | Detail fields, quantity and add to cart, review |
| Cart | Multiple products, totals, quantity from detail page, remove, guest cart persists after login, recommended item |
| Checkout | Place order with address check, invoice download, guest checkout prompt |
| Contact Us | Form with file upload, confirm dialog, success message |
| Subscription | Home footer, cart page footer |
| Navigation | Logged-in header, Test Cases page, scroll with and without arrow |

Steps appear in the HTML report through `test.step()`, and log lines are written to the console and `logs/test-run.log`.
