import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { env } from './utils/env';

dotenv.config({ quiet: true });

const storageState = '.auth/user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: env.BASE_URL,
    testIdAttribute: 'data-qa',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 45_000,
    navigationTimeout: 60_000,
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/, teardown: 'teardown' },
    { name: 'teardown', testMatch: /auth\.teardown\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState },
      dependencies: ['setup'],
      testIgnore: /auth\.(setup|teardown)\.ts/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState },
      dependencies: ['setup'],
      testIgnore: /auth\.(setup|teardown)\.ts/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState },
      dependencies: ['setup'],
      testIgnore: /auth\.(setup|teardown)\.ts/,
    },
  ],
});
