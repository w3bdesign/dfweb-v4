import { test, expect } from "@playwright/test";

test("homepage content", async ({ page, browserName }) => {
  await page.goto("http://localhost:3000/");
  
  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');

  // Increase timeout for WebKit
  const timeout = browserName === 'webkit' ? 10000 : 5000;

  // Check for the "Hei!" heading with increased timeout and additional logging
  await expect(async () => {
    const heading = page.getByRole("heading", { name: "Hei!" });
    await expect(heading).toBeVisible({ timeout });
    
    if (!(await heading.isVisible())) {
      console.log(`Heading not visible in ${browserName}. Current page title:`, await page.title());
      console.log('Page content:', await page.content());
    }
  }).toPass({ timeout });

  // Check for the subheading
  await expect(
    page.getByRole("heading", { name: "Jeg heter Daniel Fjeldstad og" })
  ).toBeVisible({ timeout });

  // Additional checks to help diagnose WebKit issues
  if (browserName === 'webkit') {
    const bodyText = await page.textContent('body');
    console.log('Body text content:', bodyText);

    const headings = await page.$$('h1, h2');
    for (const heading of headings) {
      console.log('Heading text:', await heading.textContent());
    }
  }
});

// You can add more tests here if needed
