import { test, expect } from '@playwright/test';

test('homepage has correct title and content', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Increase the timeout for all subsequent expectations
  test.setTimeout(30000);

  // Check the title
  await expect(page).toHaveTitle('Forside - Dfweb');

  // Check the main hero section
  const heroSection = page.locator('#main-hero');
  await expect(heroSection).toBeVisible();

  // Check the main heading
  const heading = page.locator('h1.introtekst');
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText('Hei!');

  // Check the subheading (h2)
  const subheading = page.locator('#main-hero h2');
  await expect(subheading).toBeVisible();

  // Check the paragraph text
  const paragraph = page.locator('#main-hero p');
  await expect(paragraph).toBeVisible();

  // Check for the presence of Icons component
  const icons = page.locator('#main-hero img[alt*="ikon"]');
  await expect(icons).toHaveCount(5); // Assuming there are 5 skill icons

  // Check the navigation menu (assuming it's outside the Hero component)
  const navItems = ['Hjem', 'Prosjekter', 'CV', 'Github', 'Kontakt'];
  for (const item of navItems) {
    const navLink = page.locator(`nav >> text=${item}`);
    await expect(navLink).toBeVisible();
  }

  // Check the "Om Meg" section (assuming it's outside the Hero component)
  const omMegHeading = page.locator('h2:has-text("Om Meg")');
  await expect(omMegHeading).toBeVisible();

  // Check the "Prosjekter" section (assuming it's outside the Hero component)
  const prosjekterHeading = page.locator('h2:has-text("Prosjekter")');
  await expect(prosjekterHeading).toBeVisible();

  // Check the footer (assuming it's outside the Hero component)
  const footer = page.locator('footer');
  await expect(footer).toContainText('Copyright Daniel Fjeldstad');
  await expect(footer).toContainText('2024');
});

test('navigation links are working', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Increase the timeout for all subsequent expectations
  test.setTimeout(30000);

  // Click on 'Prosjekter' and check if the URL changes
  await page.click('nav >> text=Prosjekter');
  await expect(page).toHaveURL(/.*prosjekter/);

  // Go back to the homepage
  await page.goto('http://localhost:3000');

  // Click on 'CV' and check if the URL changes
  await page.click('nav >> text=CV');
  await expect(page).toHaveURL(/.*cv/);
});
