import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Daniel Fjeldstad/);
});

test('has heading', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const heading = page.locator('h1');
  await expect(heading).toContainText('Daniel Fjeldstad');
});
