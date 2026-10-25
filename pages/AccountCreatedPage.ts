import { Locator, Page } from '@playwright/test';

export class AccountCreatedPage {
  readonly createdTitle: Locator;
  readonly deletedTitle: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.createdTitle = page.getByTestId('account-created');
    this.deletedTitle = page.getByTestId('account-deleted');
    this.continueButton = page.getByTestId('continue-button');
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }
}
