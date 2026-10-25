import { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  readonly nav: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;
  readonly testCasesLink: Locator;
  readonly contactUsLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly loggedInAs: Locator;

  constructor(private readonly page: Page) {
    this.nav = page.locator('.navbar-nav');
    this.homeLink = this.nav.getByRole('link', { name: 'Home' });
    this.productsLink = this.nav.getByRole('link', { name: 'Products' });
    this.cartLink = this.nav.getByRole('link', { name: 'Cart' });
    this.signupLoginLink = this.nav.getByRole('link', { name: 'Signup / Login' });
    this.testCasesLink = this.nav.getByRole('link', { name: 'Test Cases' });
    this.contactUsLink = this.nav.getByRole('link', { name: 'Contact us' });
    this.logoutLink = this.nav.getByRole('link', { name: 'Logout' });
    this.deleteAccountLink = this.nav.getByRole('link', { name: 'Delete Account' });
    this.loggedInAs = this.nav.getByText('Logged in as');
  }

  async openSignupLogin(): Promise<void> {
    await this.signupLoginLink.click();
    await this.page.waitForLoadState('load');
  }

  async openProducts(): Promise<void> {
    await this.productsLink.click();
    await this.page.waitForLoadState('load');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForLoadState('load');
  }

  async openTestCases(): Promise<void> {
    await this.testCasesLink.click();
    await this.page.waitForLoadState('load');
  }

  async openContactUs(): Promise<void> {
    await this.contactUsLink.click();
    await this.page.waitForLoadState('load');
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
  }

  async deleteAccountDirectly(): Promise<void> {
    await this.page.goto('/delete_account');
  }
}
