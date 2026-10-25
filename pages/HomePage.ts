import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly heroText: Locator;
  readonly scrollUpArrow: Locator;
  readonly recommendedHeading: Locator;
  readonly recommendedCard: Locator;
  readonly recommendedName: Locator;
  readonly recommendedAddToCart: Locator;

  constructor(private readonly page: Page) {
    this.heroText = page.getByRole('heading', { name: 'Full-Fledged practice website for Automation Engineers' }).first();
    this.scrollUpArrow = page.locator('#scrollUp');
    this.recommendedHeading = page.getByRole('heading', { name: 'recommended items' });
    this.recommendedCard = page.locator('.recommended_items .item.active .product-image-wrapper').first();
    this.recommendedName = this.recommendedCard.locator('.productinfo p');
    this.recommendedAddToCart = this.recommendedCard.locator('.productinfo').getByText('Add to cart');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async scrollToBottom(): Promise<void> {
    await this.page.locator('footer').scrollIntoViewIfNeeded();
  }

  async scrollToRecommended(): Promise<void> {
    await this.recommendedHeading.scrollIntoViewIfNeeded();
  }

  async scrollY(): Promise<number> {
    return this.page.evaluate(() => window.scrollY);
  }

  async scrollUpWithArrow(): Promise<void> {
    await this.scrollUpArrow.click();
  }

  async scrollUpWithoutArrow(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async addRecommendedToCart(): Promise<void> {
    await this.recommendedAddToCart.click();
  }
}
