import { test as base, expect } from '@playwright/test';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { CartModalComponent } from '../pages/CartModalComponent';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ContactUsPage } from '../pages/ContactUsPage';
import { FooterComponent } from '../pages/FooterComponent';
import { HeaderComponent } from '../pages/HeaderComponent';
import { HomePage } from '../pages/HomePage';
import { PaymentPage } from '../pages/PaymentPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { ProductsPage } from '../pages/ProductsPage';
import { SignupLoginPage } from '../pages/SignupLoginPage';
import { SignupPage } from '../pages/SignupPage';
import { createLogger, Logger } from '../utils/logger';

const BLOCKED_REQUESTS =
  /googlesyndication|doubleclick|adservice|googleadservices|googletagmanager|google-analytics|fundingchoices|pagead|adsbygoogle|amazon-adsystem|adnxs|taboola|outbrain/;

interface Fixtures {
  logger: Logger;
  header: HeaderComponent;
  footer: FooterComponent;
  cartModal: CartModalComponent;
  homePage: HomePage;
  signupLoginPage: SignupLoginPage;
  signupPage: SignupPage;
  accountCreatedPage: AccountCreatedPage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  contactUsPage: ContactUsPage;
}

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await page.route(BLOCKED_REQUESTS, (route) => route.abort());
    await use(page);
  },
  logger: async ({}, use, testInfo) => use(createLogger(testInfo.title)),
  header: async ({ page }, use) => use(new HeaderComponent(page)),
  footer: async ({ page }, use) => use(new FooterComponent(page)),
  cartModal: async ({ page }, use) => use(new CartModalComponent(page)),
  homePage: async ({ page }, use) => use(new HomePage(page)),
  signupLoginPage: async ({ page }, use) => use(new SignupLoginPage(page)),
  signupPage: async ({ page }, use) => use(new SignupPage(page)),
  accountCreatedPage: async ({ page }, use) => use(new AccountCreatedPage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),
  productDetailPage: async ({ page }, use) => use(new ProductDetailPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  paymentPage: async ({ page }, use) => use(new PaymentPage(page)),
  contactUsPage: async ({ page }, use) => use(new ContactUsPage(page)),
});

export { expect };
