import { test, expect } from '../fixtures';
import { AUTH_STATE_FILE, generateEmail, saveSetupUser } from '../utils/data';
import { env, url } from '../utils/env';

test('setup - register user and save session', { tag: ['@setup'] }, async ({
  page,
  logger,
  header,
  signupLoginPage,
  signupPage,
  accountCreatedPage,
}, testInfo) => {
  test.skip(testInfo.repeatEachIndex > 0, 'Session already created by the first repeat');
  const email = generateEmail('setup');

  await test.step('Register a fresh user', async () => {
    await signupLoginPage.open();
    await signupLoginPage.signup(env.NAME, email);
    await expect(signupPage.heading).toBeVisible();
    await signupPage.fillAccountDetails();
    await signupPage.createAccount();
    await expect(accountCreatedPage.createdTitle).toHaveText('Account Created!');
    await accountCreatedPage.continue();
    await expect(header.loggedInAs).toHaveText(`Logged in as ${env.NAME}`);
  });

  await test.step('Log out and log in through the UI', async () => {
    await header.logout();
    await expect(page).toHaveURL(url('/login'));
    await signupLoginPage.login(email, env.PASSWORD);
    await expect(header.loggedInAs).toHaveText(`Logged in as ${env.NAME}`);
  });

  await test.step('Save session and user data', async () => {
    saveSetupUser({ email, password: env.PASSWORD, name: env.NAME });
    await page.context().storageState({ path: AUTH_STATE_FILE });
  });

  logger.info(`Setup user ready: ${email}`);
});
