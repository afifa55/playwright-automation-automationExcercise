import { Locator, Page } from '@playwright/test';

export class FooterComponent {
  readonly subscriptionHeading: Locator;
  readonly emailInput: Locator;
  readonly subscribeButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    const footer = page.locator('footer');
    this.subscriptionHeading = footer.getByRole('heading', { name: 'Subscription' });
    this.emailInput = footer.getByPlaceholder('Your email address');
    this.subscribeButton = footer.locator('#subscribe');
    this.successMessage = footer.getByText('You have been successfully subscribed!');
  }

  async subscribe(email: string): Promise<void> {
    await this.subscriptionHeading.scrollIntoViewIfNeeded();
    await this.emailInput.fill(email);
    await this.subscribeButton.click();
  }
}
