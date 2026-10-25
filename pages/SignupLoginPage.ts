import { Locator, Page } from '@playwright/test';

export class SignupLoginPage {
  readonly signupHeading: Locator;
  readonly loginHeading: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;
  readonly signupError: Locator;

  constructor(private readonly page: Page) {
    this.signupHeading = page.getByRole('heading', { name: 'New User Signup!' });
    this.loginHeading = page.getByRole('heading', { name: 'Login to your account' });
    this.signupNameInput = page.getByTestId('signup-name');
    this.signupEmailInput = page.getByTestId('signup-email');
    this.signupButton = page.getByTestId('signup-button');
    this.loginEmailInput = page.getByTestId('login-email');
    this.loginPasswordInput = page.getByTestId('login-password');
    this.loginButton = page.getByTestId('login-button');
    this.loginError = page.getByText('Your email or password is incorrect!');
    this.signupError = page.getByText('Email Address already exist!');
  }

  async open(): Promise<void> {
    await this.page.goto('/login');
  }

  async signup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }
}
