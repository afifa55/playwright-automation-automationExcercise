import { test, expect } from '../fixtures';
import { readSetupUser } from '../utils/data';
import { url } from '../utils/env';

test.describe('Navigation', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('TC_NAV_01 - Header shows logged in user from saved session', { tag: ['@smoke', '@regression', '@navigation'] }, async ({
    logger,
    header,
  }) => {
    const user = readSetupUser();
    logger.info('Test started with saved session');

    await test.step('Verify logged in header', async () => {
      await expect(header.loggedInAs).toHaveText(`Logged in as ${user.name}`);
      await expect(header.logoutLink).toBeVisible();
      await expect(header.deleteAccountLink).toBeVisible();
      await expect(header.signupLoginLink).toBeHidden();
    });

    logger.info(`Header shows "Logged in as ${user.name}"`);
  });

  test('TC_NAV_02 - Test Cases page opens', { tag: ['@regression', '@navigation'] }, async ({ logger, header, page }) => {
    logger.info('Test started');

    await test.step('Open Test Cases page', async () => {
      await header.openTestCases();
    });

    await test.step('Verify page', async () => {
      await expect(page).toHaveURL(url('/test_cases'));
      await expect(page.getByRole('heading', { name: 'Test Cases', exact: true })).toBeVisible();
    });

    logger.info('Test Cases page opened at /test_cases');
  });

  test('TC_NAV_03 - Scroll down and up using arrow', { tag: ['@regression', '@navigation'] }, async ({
    logger,
    homePage,
    footer,
  }) => {
    logger.info('Test started');

    await test.step('Scroll to bottom', async () => {
      await homePage.scrollToBottom();
      await expect(footer.subscriptionHeading).toBeInViewport();
    });

    await test.step('Scroll up with arrow', async () => {
      await expect(homePage.scrollUpArrow).toBeVisible();
      await homePage.scrollUpWithArrow();
    });

    await test.step('Verify hero text', async () => {
      await expect.poll(() => homePage.scrollY()).toBe(0);
      await expect(homePage.heroText).toBeVisible();
    });

    logger.info('Hero text "Full-Fledged practice website for Automation Engineers" visible after arrow scroll');
  });

  test('TC_NAV_04 - Scroll down and up without arrow', { tag: ['@regression', '@navigation'] }, async ({
    logger,
    homePage,
    footer,
  }) => {
    logger.info('Test started');

    await test.step('Scroll to bottom', async () => {
      await homePage.scrollToBottom();
      await expect(footer.subscriptionHeading).toBeInViewport();
    });

    await test.step('Scroll to top without arrow', async () => {
      await homePage.scrollUpWithoutArrow();
    });

    await test.step('Verify hero text', async () => {
      await expect.poll(() => homePage.scrollY()).toBe(0);
      await expect(homePage.heroText).toBeVisible();
    });

    logger.info('Hero text "Full-Fledged practice website for Automation Engineers" visible after script scroll');
  });
});
