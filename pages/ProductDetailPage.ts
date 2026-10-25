import { Locator, Page } from '@playwright/test';

export class ProductDetailPage {
  readonly info: Locator;
  readonly name: Locator;
  readonly category: Locator;
  readonly price: Locator;
  readonly availability: Locator;
  readonly condition: Locator;
  readonly brand: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly reviewHeading: Locator;
  readonly reviewNameInput: Locator;
  readonly reviewEmailInput: Locator;
  readonly reviewTextInput: Locator;
  readonly reviewSubmitButton: Locator;
  readonly reviewSuccess: Locator;

  constructor(page: Page) {
    this.info = page.locator('.product-information');
    this.name = this.info.getByRole('heading', { level: 2 });
    this.category = this.info.locator('p', { hasText: 'Category:' });
    this.price = this.info.getByText(/^Rs\. \d+/);
    this.availability = this.info.locator('p', { hasText: 'Availability:' });
    this.condition = this.info.locator('p', { hasText: 'Condition:' });
    this.brand = this.info.locator('p', { hasText: 'Brand:' });
    this.quantityInput = this.info.getByRole('spinbutton');
    this.addToCartButton = this.info.getByRole('button', { name: 'Add to cart' });
    this.reviewHeading = page.getByRole('link', { name: 'Write Your Review' });
    this.reviewNameInput = page.getByPlaceholder('Your Name');
    this.reviewEmailInput = page.getByPlaceholder('Email Address', { exact: true });
    this.reviewTextInput = page.getByPlaceholder('Add Review Here!');
    this.reviewSubmitButton = page.getByRole('button', { name: 'Submit' });
    this.reviewSuccess = page.getByText('Thank you for your review.');
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async submitReview(name: string, email: string, review: string): Promise<void> {
    await this.reviewNameInput.fill(name);
    await this.reviewEmailInput.fill(email);
    await this.reviewTextInput.fill(review);
    await this.reviewSubmitButton.click();
  }
}
