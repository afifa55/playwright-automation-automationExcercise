import { Locator, Page } from '@playwright/test';

export class CartModalComponent {
  readonly modal: Locator;
  readonly title: Locator;
  readonly message: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.modal = page.locator('#cartModal');
    this.title = this.modal.getByRole('heading', { name: 'Added!' });
    this.message = this.modal.getByText('Your product has been added to cart.');
    this.continueShoppingButton = this.modal.getByRole('button', { name: 'Continue Shopping' });
    this.viewCartLink = this.modal.getByRole('link', { name: 'View Cart' });
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async viewCart(): Promise<void> {
    await this.viewCartLink.click();
  }
}
