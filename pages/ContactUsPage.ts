import { Locator, Page } from '@playwright/test';

export class ContactUsPage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly fileInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly homeLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Get In Touch' });
    this.nameInput = page.getByTestId('name');
    this.emailInput = page.getByTestId('email');
    this.subjectInput = page.getByTestId('subject');
    this.messageInput = page.getByTestId('message');
    this.fileInput = page.locator('input[type="file"]');
    this.submitButton = page.getByTestId('submit-button');
    this.successMessage = page.locator('#contact-page .status');
    this.homeLink = page.locator('#contact-page').getByRole('link', { name: 'Home' });
  }

  async open(): Promise<void> {
    await this.page.goto('/contact_us');
  }

  async fillForm(form: { name: string; email: string; subject: string; message: string; file: string }): Promise<void> {
    await this.nameInput.fill(form.name);
    await this.emailInput.fill(form.email);
    await this.subjectInput.fill(form.subject);
    await this.messageInput.fill(form.message);
    await this.fileInput.setInputFiles(form.file);
  }

  async submitAndAcceptDialog(): Promise<string> {
    const handleDialog = this.page.waitForEvent('dialog').then(async (dialog) => {
      const message = dialog.message();
      await dialog.accept();
      return message;
    });
    const [message] = await Promise.all([handleDialog, this.submitButton.click()]);
    return message;
  }

  async goHome(): Promise<void> {
    await this.homeLink.click();
  }
}
