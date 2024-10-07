import { test, expect } from '@playwright/test';

test.describe('Contact page', () => {
  test('loads and displays form elements correctly', async ({ page }) => {
    await page.goto('/kontakt');
    
    // Check if form labels are visible
    await expect(page.getByText('Fullt navn')).toBeVisible();
    await expect(page.getByText('Telefonnummer')).toBeVisible();
    await expect(page.getByText('Hva ønsker du å si?')).toBeVisible();
    
    // Check if submit button is visible using the new data-testid
    await expect(page.getByTestId('submit-button')).toBeVisible();
  });

  test('submit button has correct text', async ({ page }) => {
    await page.goto('/kontakt');
    
    // Check if the submit button has the correct text
    const submitButton = page.getByTestId('submit-button');
    await expect(submitButton).toHaveText('Send skjema');
  });
});