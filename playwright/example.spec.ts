import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page.getByRole("heading", { name: "Hei!" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Jeg heter Daniel Fjeldstad og" })
  ).toBeVisible();
});
