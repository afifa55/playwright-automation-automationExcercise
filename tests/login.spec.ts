import { test, expect } from '../fixtures';
import { readSetupUser } from '../utils/data';
import { env, url } from '../utils/env';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ signupLoginPage }) => {
    await signupLoginPage.open();
  });

  test('TC_LOGIN_01 - Valid login with registered user', { tag: ['@smoke', '@regression', '@login'] }, async ({
    logger,
    header,
    signupLoginPage,
    page,
  }) => {
    const user = readSetupUser();
    logger.info(`Test started for ${user.email}`);

    await test.step('Log in with valid credentials', async () => {
      await expect(signupLoginPage.loginHeading).toBeVisible();
      await signupLoginPage.login(user.email, user.password);
    });

    await test.step('Verify logged in user', async () => {
      await expect(page).toHaveURL(url('/'));
      await expect(header.loggedInAs).toHaveText(`Logged in as ${user.name}`);
      await expect(header.logoutLink).toBeVisible();
    });

    logger.info(`Logged in as ${user.name}`);
  });

  test('TC_LOGIN_02 - Invalid email shows error', { tag: ['@regression', '@negative', '@login'] }, async ({
    logger,
    signupLoginPage,
    page,
  }) => {
    logger.info(`Test started with email ${env.INVALID_EMAIL}`);

    await test.step('Log in with unregistered email', async () => {
      await signupLoginPage.login(env.INVALID_EMAIL, env.PASSWORD);
    });

    await test.step('Verify error message', async () => {
      await expect(signupLoginPage.loginError).toHaveText('Your email or password is incorrect!');
      await expect(page).toHaveURL(url('/login'));
    });

    logger.info('Login rejected with "Your email or password is incorrect!"');
  });

  test('TC_LOGIN_03 - Invalid password shows error', { tag: ['@regression', '@negative', '@login'] }, async ({
    logger,
    signupLoginPage,
    page,
  }) => {
    const user = readSetupUser();
    logger.info(`Test started with wrong password for ${user.email}`);

    await test.step('Log in with registered email and wrong password', async () => {
      await signupLoginPage.login(user.email, env.INVALID_PASSWORD);
    });

    await test.step('Verify error message', async () => {
      await expect(signupLoginPage.loginError).toHaveText('Your email or password is incorrect!');
      await expect(page).toHaveURL(url('/login'));
    });

    logger.info('Login rejected with "Your email or password is incorrect!"');
  });

  test('TC_LOGIN_04 - Logout returns to login page', { tag: ['@smoke', '@regression', '@login'] }, async ({
    logger,
    header,
    signupLoginPage,
    page,
  }) => {
    const user = readSetupUser();
    logger.info(`Test started for ${user.email}`);

    await test.step('Log in', async () => {
      await signupLoginPage.login(user.email, user.password);
      await expect(header.loggedInAs).toHaveText(`Logged in as ${user.name}`);
    });

    await test.step('Log out', async () => {
      await header.logout();
    });

    await test.step('Verify login page is shown', async () => {
      await expect(page).toHaveURL(url('/login'));
      await expect(signupLoginPage.loginHeading).toBeVisible();
      await expect(header.loggedInAs).toBeHidden();
    });

    logger.info('Logged out and returned to /login');
  });
});
