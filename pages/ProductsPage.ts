import { expect, Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly allProductsHeading: Locator;
  readonly searchedProductsHeading: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(private readonly page: Page) {
    this.allProductsHeading = page.getByRole('heading', { name: 'All Products' });
    this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products' });
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.productNames = this.productCards.locator('.productinfo p');
    this.searchInput = page.getByPlaceholder('Search Product');
    this.searchButton = page.locator('#submit_search');
  }

  async open(): Promise<void> {
    await this.page.goto('/products');
  }

  card(name: string): Locator {
    return this.productCards.filter({ has: this.page.locator('.productinfo').getByText(name, { exact: true }) });
  }

  cardName(card: Locator): Locator {
    return card.locator('.productinfo p');
  }

  cardPrice(card: Locator): Locator {
    return card.locator('.productinfo h2');
  }

  cardImage(card: Locator): Locator {
    return card.locator('.productinfo').getByRole('img');
  }

  cardAddToCart(card: Locator): Locator {
    return card.locator('.productinfo').getByText('Add to cart');
  }

  async addToCart(name: string): Promise<void> {
    const card = this.card(name);
    const overlayButton = card.locator('.product-overlay').getByText('Add to cart');
    await card.hover();
    await expect(overlayButton).toBeVisible();
    await overlayButton.click();
  }

  async viewProduct(name: string): Promise<void> {
    await this.card(name).getByRole('link', { name: 'View Product' }).click();
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  categoryHeading(category: string, subCategory: string): Locator {
    return this.page.getByRole('heading', { name: `${category} - ${subCategory} Products` });
  }

  async selectCategory(category: string, subCategory: string): Promise<void> {
    const toggle = this.page.getByRole('link', { name: new RegExp(`^\\W*${category}$`) });
    await toggle.click();
    await this.page.locator(`#${category}`).getByRole('link', { name: subCategory }).click();
  }

  brandHeading(brand: string): Locator {
    return this.page.getByRole('heading', { name: `Brand - ${brand} Products` });
  }

  async selectBrand(brand: string): Promise<void> {
    await this.page.locator('.brands-name').getByRole('link', { name: brand }).click();
  }
}
