import { Download, Locator, Page } from '@playwright/test';

export class PaymentPage {
  readonly heading: Locator;
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;
  readonly orderPlacedTitle: Locator;
  readonly orderConfirmedMessage: Locator;
  readonly downloadInvoiceLink: Locator;
  readonly continueButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Payment' });
    this.nameOnCardInput = page.getByTestId('name-on-card');
    this.cardNumberInput = page.getByTestId('card-number');
    this.cvcInput = page.getByTestId('cvc');
    this.expiryMonthInput = page.getByTestId('expiry-month');
    this.expiryYearInput = page.getByTestId('expiry-year');
    this.payButton = page.getByTestId('pay-button');
    this.orderPlacedTitle = page.getByTestId('order-placed');
    this.orderConfirmedMessage = page.getByText('Congratulations! Your order has been confirmed!');
    this.downloadInvoiceLink = page.getByRole('link', { name: 'Download Invoice' });
    this.continueButton = page.getByTestId('continue-button');
  }

  async pay(card: { name: string; number: string; cvc: string; month: string; year: string }): Promise<void> {
    await this.nameOnCardInput.fill(card.name);
    await this.cardNumberInput.fill(card.number);
    await this.cvcInput.fill(card.cvc);
    await this.expiryMonthInput.fill(card.month);
    await this.expiryYearInput.fill(card.year);
    await this.payButton.click();
  }

  async downloadInvoice(): Promise<Download> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadInvoiceLink.click();
    return downloadPromise;
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }
}
