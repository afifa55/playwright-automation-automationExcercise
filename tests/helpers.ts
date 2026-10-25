import { expect } from '../fixtures';
import { CartModalComponent } from '../pages/CartModalComponent';
import { CartPage } from '../pages/CartPage';
import { ProductsPage } from '../pages/ProductsPage';
import { parsePrice } from '../utils/data';

export const addProductToCart = async (
  productsPage: ProductsPage,
  cartModal: CartModalComponent,
  name: string,
): Promise<void> => {
  await productsPage.addToCart(name);
  await expect(cartModal.title).toBeVisible();
  await expect(cartModal.message).toBeVisible();
  await cartModal.continueShopping();
  await expect(cartModal.modal).toBeHidden();
};

export const verifyCartRow = async (
  cartPage: CartPage,
  name: string,
  price: number,
  quantity: number,
): Promise<number> => {
  await expect(cartPage.row(name)).toBeVisible();
  await expect(cartPage.price(name)).toHaveText(`Rs. ${price}`);
  await expect(cartPage.quantity(name)).toHaveText(String(quantity));
  const unitPrice = parsePrice(await cartPage.price(name).innerText());
  const units = Number(await cartPage.quantity(name).innerText());
  await expect(cartPage.total(name)).toHaveText(`Rs. ${unitPrice * units}`);
  return unitPrice * units;
};
