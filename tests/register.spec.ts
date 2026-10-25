import { test, expect } from '../fixtures';
import { generateEmail, readSetupUser } from '../utils/data';
import { env, url } from '../utils/env';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Register', () => {
  let accountCreated = false;

  test.beforeEach(async ({ signupLoginPage }) => {
    accountCreated = false;
    await signupLoginPage.open();
  });

  test.afterEach(async ({ header }) => {
    if (accountCreated) await header.deleteAccountDirectly();
  });

  test('TC_REGISTER_01 - Register new user and delete account', { tag: ['@smoke', '@regression', '@e2e', '@register'] }, async ({
    logger,
    header,
    signupLoginPage,
    signupPage,
    accountCreatedPage,
    page,
  }) => {
    const email = generateEmail('register');
    logger.info(`Test started with email ${email}`);

    await test.step('Start signup with name and email', async () => {
      await expect(signupLoginPage.signupHeading).toBeVisible();
      await signupLoginPage.signup(env.NAME, email);
      await expect(signupPage.heading).toBeVisible();
      await expect(signupPage.nameInput).toHaveValue(env.NAME);
      await expect(signupPage.emailInput).toHaveValue(email);
    });

    await test.step('Fill account details and create account', async () => {
      await signupPage.fillAccountDetails();
      await signupPage.createAccount();
      accountCreated = true;
      await expect(accountCreatedPage.createdTitle).toHaveText('Account Created!');
    });

    await test.step('Continue and verify logged in user', async () => {
      await accountCreatedPage.continue();
      await expect(header.loggedInAs).toHaveText(`Logged in as ${env.NAME}`);
    });

    await test.step('Delete account', async () => {
      await header.deleteAccount();
      accountCreated = false;
      await expect(accountCreatedPage.deletedTitle).toHaveText('Account Deleted!');
      await accountCreatedPage.continue();
      await expect(page).toHaveURL(url('/'));
      await expect(header.signupLoginLink).toBeVisible();
    });

    logger.info(`User ${email} registered as "${env.NAME}" and deleted`);
  });

  test('TC_REGISTER_02 - Register with existing email shows error', { tag: ['@regression', '@negative', '@register'] }, async ({
    logger,
    signupLoginPage,
    page,
  }) => {
    const { email } = readSetupUser();
    logger.info(`Test started with existing email ${email}`);

    await test.step('Try to sign up with an already registered email', async () => {
      await signupLoginPage.signup(env.NAME, email);
    });

    await test.step('Verify error message', async () => {
      await expect(signupLoginPage.signupError).toHaveText('Email Address already exist!');
      await expect(page).toHaveURL(url('/signup'));
    });

    logger.info('Duplicate signup rejected with "Email Address already exist!"');
  });
});
