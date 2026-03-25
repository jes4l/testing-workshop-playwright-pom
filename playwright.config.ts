import { defineConfig, devices } from '@playwright/test';

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 60 * 1000, 
  expect: { timeout: 15 * 1000 }, 
  reporter: "html",
  use: {
    baseURL: 'https://jesal.wiki', // Your app URL
    trace: "retain-on-first-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    }
  ],
});