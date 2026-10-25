import { test, expect } from '../fixtures';
import { env } from '../utils/env';

test.describe('Product detail', () => {
  test.beforeEach(async ({ productsPage, productDetailPage }) => {
    await productsPage.open();
    await productsPage.viewProduct(env.PRODUCT_NAME);
    await expect(productDetailPage.name).toHaveText(env.PRODUCT_NAME);
  });

  test('TC_DETAIL_01 - Product details are visible', { tag: ['@smoke', '@regression', '@products'] }, async ({
    logger,
    productDetailPage,
  }) => {
    logger.info(`Test started for ${env.PRODUCT_NAME}`);

    await test.step('Verify product information', async () => {
      await expect(productDetailPage.name).toHaveText(env.PRODUCT_NAME);
      await expect(productDetailPage.category).toHaveText(`Category: ${env.PRODUCT_CATEGORY}`);
      await expect(productDetailPage.price).toHaveText(`Rs. ${env.PRODUCT_PRICE}`);
      await expect(productDetailPage.availability).toHaveText('Availability: In Stock');
      await expect(productDetailPage.condition).toHaveText('Condition: New');
      await expect(productDetailPage.brand).toHaveText(`Brand: ${env.PRODUCT_BRAND}`);
    });

    logger.info(`${env.PRODUCT_NAME}: ${env.PRODUCT_CATEGORY}, Rs. ${env.PRODUCT_PRICE}, In Stock, New, ${env.PRODUCT_BRAND}`);
  });

  test('TC_DETAIL_02 - Change quantity and add to cart', { tag: ['@regression', '@products', '@cart'] }, async ({
    logger,
    productDetailPage,
    cartModal,
  }) => {
    logger.info(`Test started with quantity ${env.QUANTITY}`);

    await test.step('Change quantity', async () => {
      await productDetailPage.setQuantity(env.QUANTITY);
      await expect(productDetailPage.quantityInput).toHaveValue(String(env.QUANTITY));
    });

    await test.step('Add to cart and close confirmation', async () => {
      await productDetailPage.addToCart();
      await expect(cartModal.title).toBeVisible();
      await expect(cartModal.message).toBeVisible();
      await cartModal.continueShopping();
      await expect(cartModal.modal).toBeHidden();
    });

    logger.info(`Added ${env.QUANTITY} x ${env.PRODUCT_NAME} to cart`);
  });

  test('TC_DETAIL_03 - Write a review', { tag: ['@regression', '@products'] }, async ({ logger, productDetailPage }) => {
    logger.info('Test started');

    await test.step('Submit review', async () => {
      await expect(productDetailPage.reviewHeading).toBeVisible();
      await productDetailPage.submitReview(env.REVIEW_NAME, env.REVIEW_EMAIL, env.REVIEW_TEXT);
    });

    await test.step('Verify success message', async () => {
      await expect(productDetailPage.reviewSuccess).toHaveText('Thank you for your review.');
    });

    logger.info('Review submitted: "Thank you for your review."');
  });
});
