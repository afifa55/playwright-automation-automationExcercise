import { Locator, Page } from '@playwright/test';
import { env } from '../utils/env';

export class SignupPage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly createAccountButton: Locator;
  private readonly passwordInput: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByText('Enter Account Information');
    this.nameInput = page.getByTestId('name');
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.createAccountButton = page.getByTestId('create-account');
  }

  async fillAccountDetails(): Promise<void> {
    await this.page.getByRole('radio', { name: `${env.TITLE}.` }).check();
    await this.passwordInput.fill(env.PASSWORD);
    await this.page.getByTestId('days').selectOption(env.BIRTH_DAY);
    await this.page.getByTestId('months').selectOption(env.BIRTH_MONTH);
    await this.page.getByTestId('years').selectOption(env.BIRTH_YEAR);
    await this.page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
    await this.page.getByRole('checkbox', { name: 'Receive special offers from our partners!' }).check();
    await this.page.getByTestId('first_name').fill(env.FIRST_NAME);
    await this.page.getByTestId('last_name').fill(env.LAST_NAME);
    await this.page.getByTestId('company').fill(env.COMPANY);
    await this.page.getByTestId('address').fill(env.ADDRESS);
    await this.page.getByTestId('country').selectOption(env.COUNTRY);
    await this.page.getByTestId('state').fill(env.STATE);
    await this.page.getByTestId('city').fill(env.CITY);
    await this.page.getByTestId('zipcode').fill(env.ZIPCODE);
    await this.page.getByTestId('mobile_number').fill(env.MOBILE);
  }

  async createAccount(): Promise<void> {
    await this.createAccountButton.click();
  }
}
