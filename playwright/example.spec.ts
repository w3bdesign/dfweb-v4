import { test, expect } from '@playwright/test';

test('homepage content and structure', async ({ page, browserName }) => {
  // Note: WebKit tests are skipped on Windows due to SSL certificate issues
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('heading', { name: 'Hei!' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Jeg heter Daniel Fjeldstad og' })
  ).toBeVisible();
});
