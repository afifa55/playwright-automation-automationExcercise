import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly rows: Locator;
  readonly deleteButtons: Locator;
  readonly emptyMessage: Locator;
  readonly proceedToCheckoutLink: Locator;
  readonly checkoutModal: Locator;
  readonly checkoutModalMessage: Locator;
  readonly checkoutModalLoginLink: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.locator('#cart_info_table tbody tr');
    this.deleteButtons = this.rows.locator('.cart_quantity_delete');
    this.emptyMessage = page.getByText('Cart is empty!');
    this.proceedToCheckoutLink = page.locator('a.check_out');
    this.checkoutModal = page.locator('#checkoutModal');
    this.checkoutModalMessage = this.checkoutModal.getByText('Register / Login account to proceed on checkout.');
    this.checkoutModalLoginLink = this.checkoutModal.getByRole('link', { name: 'Register / Login' });
  }

  async open(): Promise<void> {
    await this.page.goto('/view_cart');
  }

  row(name: string): Locator {
    return this.rows.filter({ has: this.page.locator('.cart_description').getByRole('link', { name, exact: true }) });
  }

  price(name: string): Locator {
    return this.row(name).locator('.cart_price');
  }

  quantity(name: string): Locator {
    return this.row(name).locator('.cart_quantity');
  }

  total(name: string): Locator {
    return this.row(name).locator('.cart_total');
  }

  async remove(name: string): Promise<void> {
    await this.row(name).locator('.cart_quantity_delete').click();
  }

  async clear(): Promise<void> {
    await this.open();
    let remaining = await this.deleteButtons.count();
    while (remaining > 0) {
      await this.deleteButtons.first().click();
      remaining -= 1;
      await expect(this.deleteButtons).toHaveCount(remaining);
    }
    await expect(this.emptyMessage).toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutLink.click();
  }

  async goToLoginFromModal(): Promise<void> {
    await this.checkoutModalLoginLink.click();
  }
}
