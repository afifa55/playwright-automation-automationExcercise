import { test, expect } from '../fixtures';
import { env } from '../utils/env';

test.describe('Search', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.open();
  });

  test('TC_SEARCH_01 - Valid keyword returns matching products', { tag: ['@smoke', '@regression', '@products'] }, async ({
    logger,
    productsPage,
  }) => {
    logger.info(`Test started with keyword "${env.SEARCH_KEYWORD}"`);

    await test.step('Search for keyword', async () => {
      await productsPage.search(env.SEARCH_KEYWORD);
      await expect(productsPage.searchedProductsHeading).toBeVisible();
    });

    await test.step('Verify results are found', async () => {
      await expect.poll(() => productsPage.productCards.count()).toBeGreaterThan(0);
    });

    await test.step('Verify every result contains the keyword', async () => {
      const names = await productsPage.productNames.all();
      for (const name of names) {
        await expect(name).toContainText(new RegExp(env.SEARCH_KEYWORD, 'i'));
      }
      logger.info(`${names.length} results all contain "${env.SEARCH_KEYWORD}"`);
    });
  });

  test('TC_SEARCH_02 - Keyword with no match returns no products', { tag: ['@regression', '@negative', '@products'] }, async ({
    logger,
    productsPage,
  }) => {
    logger.info(`Test started with keyword "${env.NO_RESULT_KEYWORD}"`);

    await test.step('Search for unknown keyword', async () => {
      await productsPage.search(env.NO_RESULT_KEYWORD);
      await expect(productsPage.searchedProductsHeading).toBeVisible();
    });

    await test.step('Verify no products are shown', async () => {
      await expect(productsPage.productCards).toHaveCount(0);
    });

    logger.info(`No results for "${env.NO_RESULT_KEYWORD}"`);
  });
});
