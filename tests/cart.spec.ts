import { test, expect } from '../fixtures';
import { readSetupUser } from '../utils/data';
import { env, url } from '../utils/env';
import { addProductToCart, verifyCartRow } from './helpers';

test.describe('Cart - logged in', () => {
  test.beforeEach(async ({ cartPage, productsPage }) => {
    await cartPage.clear();
    await productsPage.open();
  });

  test('TC_CART_01 - Add multiple products and verify price, quantity and total', { tag: ['@smoke', '@regression', '@e2e', '@cart'] }, async ({
    logger,
    productsPage,
    cartModal,
    header,
    cartPage,
    page,
  }) => {
    logger.info(`Test started with ${env.PRODUCT_NAME} and ${env.SECOND_PRODUCT_NAME}`);

    await test.step('Add first product', async () => {
      await addProductToCart(productsPage, cartModal, env.PRODUCT_NAME);
    });

    await test.step('Add second product', async () => {
      await addProductToCart(productsPage, cartModal, env.SECOND_PRODUCT_NAME);
    });

    await test.step('Open cart and verify rows', async () => {
      await header.openCart();
      await expect(page).toHaveURL(url('/view_cart'));
      await expect(cartPage.rows).toHaveCount(2);
      const first = await verifyCartRow(cartPage, env.PRODUCT_NAME, env.PRODUCT_PRICE, 1);
      const second = await verifyCartRow(cartPage, env.SECOND_PRODUCT_NAME, env.SECOND_PRODUCT_PRICE, 1);
      logger.info(`Cart verified: ${env.PRODUCT_NAME} Rs. ${first}, ${env.SECOND_PRODUCT_NAME} Rs. ${second}`);
    });
  });

  test('TC_CART_02 - Quantity from detail page is reflected in cart', { tag: ['@regression', '@cart'] }, async ({
    logger,
    productsPage,
    productDetailPage,
    cartModal,
    cartPage,
  }) => {
    logger.info(`Test started with quantity ${env.QUANTITY}`);

    await test.step('Open product detail and set quantity', async () => {
      await productsPage.viewProduct(env.PRODUCT_NAME);
      await expect(productDetailPage.name).toHaveText(env.PRODUCT_NAME);
      await productDetailPage.setQuantity(env.QUANTITY);
      await expect(productDetailPage.quantityInput).toHaveValue(String(env.QUANTITY));
    });

    await test.step('Add to cart and open cart', async () => {
      await productDetailPage.addToCart();
      await expect(cartModal.title).toBeVisible();
      await cartModal.viewCart();
    });

    await test.step('Verify quantity and total', async () => {
      const total = await verifyCartRow(cartPage, env.PRODUCT_NAME, env.PRODUCT_PRICE, env.QUANTITY);
      logger.info(`Cart: ${env.PRODUCT_NAME} x ${env.QUANTITY}, total Rs. ${total}`);
    });
  });

  test('TC_CART_03 - Remove product from cart', { tag: ['@regression', '@cart'] }, async ({
    logger,
    productsPage,
    cartModal,
    header,
    cartPage,
  }) => {
    logger.info(`Test started with ${env.PRODUCT_NAME}`);

    await test.step('Add product and open cart', async () => {
      await addProductToCart(productsPage, cartModal, env.PRODUCT_NAME);
      await header.openCart();
      await expect(cartPage.row(env.PRODUCT_NAME)).toBeVisible();
    });

    await test.step('Remove product', async () => {
      await cartPage.remove(env.PRODUCT_NAME);
    });

    await test.step('Verify cart is empty', async () => {
      await expect(cartPage.row(env.PRODUCT_NAME)).toHaveCount(0);
      await expect(cartPage.emptyMessage).toHaveText(/Cart is empty!/);
    });

    logger.info(`${env.PRODUCT_NAME} removed, cart is empty`);
  });

  test('TC_CART_04 - Add recommended item to cart', { tag: ['@regression', '@cart'] }, async ({
    logger,
    homePage,
    cartModal,
    cartPage,
  }) => {
    logger.info('Test started');
    let name = '';

    await test.step('Find a recommended item', async () => {
      await homePage.open();
      await homePage.scrollToRecommended();
      await expect(homePage.recommendedHeading).toBeVisible();
      await expect(homePage.recommendedName).toHaveText(/\S/);
      name = (await homePage.recommendedName.innerText()).trim();
    });

    await test.step('Add recommended item to cart', async () => {
      await homePage.addRecommendedToCart();
      await expect(cartModal.title).toBeVisible();
      await cartModal.viewCart();
    });

    await test.step('Verify item is in cart', async () => {
      await expect(cartPage.row(name)).toBeVisible();
      await expect(cartPage.quantity(name)).toHaveText('1');
    });

    logger.info(`Recommended item "${name}" added to cart`);
  });
});

test.describe('Cart - guest', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC_CART_05 - Guest cart persists after login', { tag: ['@regression', '@e2e', '@cart'] }, async ({
    logger,
    productsPage,
    cartModal,
    header,
    cartPage,
    signupLoginPage,
  }) => {
    const user = readSetupUser();
    logger.info(`Test started as guest, will log in as ${user.email}`);

    await test.step('Add product as guest', async () => {
      await productsPage.open();
      await addProductToCart(productsPage, cartModal, env.PRODUCT_NAME);
      await header.openCart();
      await verifyCartRow(cartPage, env.PRODUCT_NAME, env.PRODUCT_PRICE, 1);
    });

    await test.step('Log in', async () => {
      await header.openSignupLogin();
      await signupLoginPage.login(user.email, user.password);
      await expect(header.loggedInAs).toHaveText(`Logged in as ${user.name}`);
    });

    await test.step('Verify cart still has the product', async () => {
      await header.openCart();
      const total = await verifyCartRow(cartPage, env.PRODUCT_NAME, env.PRODUCT_PRICE, 1);
      logger.info(`Cart persisted after login: ${env.PRODUCT_NAME}, total Rs. ${total}`);
    });

    await test.step('Clean up cart', async () => {
      await cartPage.clear();
    });
  });
});
