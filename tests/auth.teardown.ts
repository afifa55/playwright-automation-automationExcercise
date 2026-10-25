import { test, expect } from '../fixtures';
import { readSetupUser, removeSetupUser } from '../utils/data';

test.use({ storageState: { cookies: [], origins: [] } });

test('teardown - delete setup user account', { tag: ['@setup'] }, async ({
  logger,
  header,
  signupLoginPage,
  accountCreatedPage,
}, testInfo) => {
  test.skip(testInfo.repeatEachIndex > 0, 'Account is deleted once, by the first repeat');
  const user = readSetupUser();

  await test.step('Log in as the setup user', async () => {
    await signupLoginPage.open();
    await signupLoginPage.login(user.email, user.password);
    await expect(header.loggedInAs).toHaveText(`Logged in as ${user.name}`);
  });

  await test.step('Delete the account', async () => {
    await header.deleteAccount();
    await expect(accountCreatedPage.deletedTitle).toHaveText('Account Deleted!');
  });

  removeSetupUser();
  logger.info(`Setup user deleted: ${user.email}`);
});
