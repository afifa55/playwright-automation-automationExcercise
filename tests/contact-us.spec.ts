import { test, expect } from '../fixtures';
import { generateEmail, UPLOAD_FILE } from '../utils/data';
import { env, url } from '../utils/env';

test.describe('Contact us', () => {
  test.beforeEach(async ({ homePage, header, contactUsPage }) => {
    await homePage.open();
    await header.openContactUs();
    await expect(contactUsPage.heading).toBeVisible();
  });

  test('TC_CONTACT_01 - Submit contact form with file upload', { tag: ['@smoke', '@regression', '@e2e', '@contact'] }, async ({
    logger,
    contactUsPage,
    page,
  }) => {
    const email = generateEmail('contact');
    logger.info(`Test started with email ${email}`);

    await test.step('Fill form and attach file', async () => {
      await contactUsPage.fillForm({
        name: env.NAME,
        email,
        subject: env.CONTACT_SUBJECT,
        message: env.CONTACT_MESSAGE,
        file: UPLOAD_FILE,
      });
      await expect(contactUsPage.subjectInput).toHaveValue(env.CONTACT_SUBJECT);
    });

    await test.step('Submit and accept confirm dialog', async () => {
      const dialogMessage = await contactUsPage.submitAndAcceptDialog();
      expect(dialogMessage).toBe('Press OK to proceed!');
    });

    await test.step('Verify success message', async () => {
      await expect(contactUsPage.successMessage).toHaveText('Success! Your details have been submitted successfully.');
    });

    await test.step('Return to home page', async () => {
      await contactUsPage.goHome();
      await expect(page).toHaveURL(url('/'));
    });

    logger.info('Contact form submitted: "Success! Your details have been submitted successfully."');
  });
});
