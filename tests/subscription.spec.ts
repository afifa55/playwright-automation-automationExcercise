import { test, expect } from '../fixtures';
import { generateEmail } from '../utils/data';

test.describe('Subscription', () => {
  test('TC_SUBSCRIPTION_01 - Subscribe from home page footer', { tag: ['@smoke', '@regression', '@subscription'] }, async ({
    logger,
    homePage,
    footer,
  }) => {
    const email = generateEmail('subscribe');
    logger.info(`Test started with email ${email}`);

    await test.step('Subscribe from footer', async () => {
      await homePage.open();
      await footer.subscribe(email);
    });

    await test.step('Verify success message', async () => {
      await expect(footer.successMessage).toHaveText('You have been successfully subscribed!');
    });

    logger.info(`Subscribed ${email} from home page`);
  });

  test('TC_SUBSCRIPTION_02 - Subscribe from cart page footer', { tag: ['@regression', '@subscription'] }, async ({
    logger,
    cartPage,
    footer,
  }) => {
    const email = generateEmail('subscribe');
    logger.info(`Test started with email ${email}`);

    await test.step('Subscribe from cart page footer', async () => {
      await cartPage.open();
      await footer.subscribe(email);
    });

    await test.step('Verify success message', async () => {
      await expect(footer.successMessage).toHaveText('You have been successfully subscribed!');
    });

    logger.info(`Subscribed ${email} from cart page`);
  });
});
