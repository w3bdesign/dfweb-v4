import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/kontakt');
  await expect(page.getByText('Fullt navn')).toBeVisible();
  await expect(page.getByText('Telefonnummer')).toBeVisible();
  await expect(page.getByText('Hva ønsker du å si?')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send skjema Send skjema Send' })).toBeVisible();
});