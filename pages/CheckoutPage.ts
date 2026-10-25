import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly orderRows: Locator;
  readonly totalAmount: Locator;
  readonly commentInput: Locator;
  readonly placeOrderLink: Locator;

  constructor(private readonly page: Page) {
    this.deliveryAddress = page.locator('#address_delivery');
    this.billingAddress = page.locator('#address_invoice');
    this.orderRows = page.locator('#cart_info tbody tr');
    this.totalAmount = this.orderRows.filter({ hasText: 'Total Amount' }).locator('.cart_total_price');
    this.commentInput = page.locator('textarea[name="message"]');
    this.placeOrderLink = page.getByRole('link', { name: 'Place Order' });
  }

  async open(): Promise<void> {
    await this.page.goto('/checkout');
  }

  orderRow(name: string): Locator {
    return this.orderRows.filter({ has: this.page.locator('.cart_description').getByRole('link', { name, exact: true }) });
  }

  async addComment(comment: string): Promise<void> {
    await this.commentInput.fill(comment);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderLink.click();
  }
}
