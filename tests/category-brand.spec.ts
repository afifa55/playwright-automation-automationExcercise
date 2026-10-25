import { test, expect } from '../fixtures';
import { env } from '../utils/env';

const categories = [
  { category: 'Women', sub: env.CATEGORY_WOMEN_SUB, id: '01' },
  { category: 'Men', sub: env.CATEGORY_MEN_SUB, id: '02' },
  { category: 'Kids', sub: env.CATEGORY_KIDS_SUB, id: '03' },
];

test.describe('Category and brand', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.open();
  });

  for (const { category, sub, id } of categories) {
    test(`TC_CATEGORY_${id} - Filter by ${category} - ${sub}`, { tag: ['@regression', '@products'] }, async ({
      logger,
      productsPage,
    }) => {
      logger.info(`Test started for ${category} - ${sub}`);

      await test.step(`Select ${category} > ${sub}`, async () => {
        await productsPage.selectCategory(category, sub);
      });

      await test.step('Verify page title and products', async () => {
        await expect(productsPage.categoryHeading(category, sub)).toBeVisible();
        await expect.poll(() => productsPage.productCards.count()).toBeGreaterThan(0);
        await expect(productsPage.productCards.first()).toBeVisible();
      });

      logger.info(`"${category} - ${sub} Products" shows ${await productsPage.productCards.count()} products`);
    });
  }

  test('TC_BRAND_01 - Filter by brand', { tag: ['@smoke', '@regression', '@products'] }, async ({ logger, productsPage }) => {
    logger.info(`Test started for brand ${env.BRAND}`);

    await test.step(`Select brand ${env.BRAND}`, async () => {
      await productsPage.selectBrand(env.BRAND);
    });

    await test.step('Verify page title and products', async () => {
      await expect(productsPage.brandHeading(env.BRAND)).toBeVisible();
      await expect.poll(() => productsPage.productCards.count()).toBeGreaterThan(0);
      await expect(productsPage.productCards.first()).toBeVisible();
    });

    logger.info(`"Brand - ${env.BRAND} Products" shows ${await productsPage.productCards.count()} products`);
  });
});
