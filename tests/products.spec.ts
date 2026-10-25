import { test, expect } from '../fixtures';
import { url } from '../utils/env';

test.describe('Products', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.open();
  });

  test('TC_PRODUCTS_01 - All products page is visible', { tag: ['@smoke', '@regression', '@products'] }, async ({
    logger,
    productsPage,
    page,
  }) => {
    logger.info('Test started');

    await test.step('Verify products page', async () => {
      await expect(page).toHaveURL(url('/products'));
      await expect(productsPage.allProductsHeading).toBeVisible();
    });

    await test.step('Verify products are listed', async () => {
      await expect.poll(() => productsPage.productCards.count()).toBeGreaterThan(0);
    });

    logger.info(`Products listed: ${await productsPage.productCards.count()}`);
  });

  test('TC_PRODUCTS_02 - Each product card shows name, price, image and Add to cart', { tag: ['@regression', '@products'] }, async ({
    logger,
    productsPage,
  }) => {
    logger.info('Test started');
    await expect.poll(() => productsPage.productCards.count()).toBeGreaterThan(0);
    const cards = await productsPage.productCards.all();

    await test.step(`Verify ${cards.length} product cards`, async () => {
      for (const card of cards) {
        await expect(productsPage.cardName(card)).toHaveText(/\S/);
        await expect(productsPage.cardPrice(card)).toHaveText(/^Rs\. \d+$/);
        await expect(productsPage.cardImage(card)).toBeVisible();
        await expect(productsPage.cardAddToCart(card)).toBeVisible();
      }
    });

    logger.info(`Verified ${cards.length} product cards`);
  });
});
