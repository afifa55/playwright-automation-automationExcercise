import fs from 'fs';
import { test, expect } from '../fixtures';
import { env, url } from '../utils/env';
import { addProductToCart, verifyCartRow } from './helpers';

test.describe('Checkout - logged in', () => {
  test.beforeEach(async ({ cartPage, productsPage, cartModal, header }) => {
    await cartPage.clear();
    await productsPage.open();
    await addProductToCart(productsPage, cartModal, env.PRODUCT_NAME);
    await header.openCart();
  });

  test('TC_CHECKOUT_01 - Place order as logged in user', { tag: ['@smoke', '@regression', '@e2e', '@checkout'] }, async ({
    logger,
    cartPage,
    checkoutPage,
    paymentPage,
    page,
  }) => {
    logger.info(`Test started with ${env.PRODUCT_NAME}`);
    let total = 0;

    await test.step('Proceed to checkout', async () => {
      total = await verifyCartRow(cartPage, env.PRODUCT_NAME, env.PRODUCT_PRICE, 1);
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(url('/checkout'));
    });

    await test.step('Verify delivery and billing address', async () => {
      for (const address of [checkoutPage.deliveryAddress, checkoutPage.billingAddress]) {
        await expect(address).toContainText(`${env.TITLE}. ${env.FIRST_NAME} ${env.LAST_NAME}`);
        await expect(address).toContainText(env.COMPANY);
        await expect(address).toContainText(env.ADDRESS);
        await expect(address).toContainText(`${env.CITY} ${env.STATE} ${env.ZIPCODE}`);
        await expect(address).toContainText(env.COUNTRY);
        await expect(address).toContainText(env.MOBILE);
      }
    });

    await test.step('Review order and add comment', async () => {
      await expect(checkoutPage.orderRow(env.PRODUCT_NAME)).toBeVisible();
      await expect(checkoutPage.totalAmount).toHaveText(`Rs. ${total}`);
      await checkoutPage.addComment(env.ORDER_COMMENT);
      await expect(checkoutPage.commentInput).toHaveValue(env.ORDER_COMMENT);
      await checkoutPage.placeOrder();
      await expect(page).toHaveURL(url('/payment'));
    });

    await test.step('Pay and verify order placed', async () => {
      await paymentPage.pay({
        name: env.CARD_NAME,
        number: env.CARD_NUMBER,
        cvc: env.CVC,
        month: env.EXPIRY_MONTH,
        year: env.EXPIRY_YEAR,
      });
      await expect(paymentPage.orderPlacedTitle).toHaveText('Order Placed!');
      await expect(paymentPage.orderConfirmedMessage).toBeVisible();
    });

    logger.info(`Order placed, total: Rs. ${total}`);
  });

  test('TC_CHECKOUT_02 - Download invoice after order', { tag: ['@regression', '@e2e', '@checkout'] }, async ({
    logger,
    cartPage,
    checkoutPage,
    paymentPage,
  }) => {
    logger.info('Test started');
    let total = 0;

    await test.step('Place order', async () => {
      total = await verifyCartRow(cartPage, env.PRODUCT_NAME, env.PRODUCT_PRICE, 1);
      await cartPage.proceedToCheckout();
      await expect(checkoutPage.deliveryAddress).toBeVisible();
      await checkoutPage.placeOrder();
      await paymentPage.pay({
        name: env.CARD_NAME,
        number: env.CARD_NUMBER,
        cvc: env.CVC,
        month: env.EXPIRY_MONTH,
        year: env.EXPIRY_YEAR,
      });
      await expect(paymentPage.orderPlacedTitle).toHaveText('Order Placed!');
    });

    await test.step('Download invoice and verify file', async () => {
      await expect(paymentPage.downloadInvoiceLink).toBeVisible();
      const download = await paymentPage.downloadInvoice();
      expect(download.suggestedFilename()).toBe('invoice.txt');
      const filePath = await download.path();
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain(env.NAME);
      expect(content).toContain(String(total));
    });

    await test.step('Continue to home page', async () => {
      await paymentPage.continue();
    });

    logger.info(`Invoice downloaded for total Rs. ${total}`);
  });
});

test.describe('Checkout - guest', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC_CHECKOUT_03 - Guest checkout prompts to register or login', { tag: ['@regression', '@negative', '@checkout'] }, async ({
    logger,
    productsPage,
    cartModal,
    header,
    cartPage,
    signupLoginPage,
    page,
  }) => {
    logger.info('Test started as guest');

    await test.step('Add product and open cart', async () => {
      await productsPage.open();
      await addProductToCart(productsPage, cartModal, env.PRODUCT_NAME);
      await header.openCart();
      await expect(cartPage.row(env.PRODUCT_NAME)).toBeVisible();
    });

    await test.step('Proceed to checkout and verify prompt', async () => {
      await cartPage.proceedToCheckout();
      await expect(cartPage.checkoutModalMessage).toBeVisible();
      await expect(cartPage.checkoutModalLoginLink).toBeVisible();
    });

    await test.step('Follow Register / Login link', async () => {
      await cartPage.goToLoginFromModal();
      await expect(page).toHaveURL(url('/login'));
      await expect(signupLoginPage.loginHeading).toBeVisible();
    });

    logger.info('Guest checkout redirected to /login');
  });
});
