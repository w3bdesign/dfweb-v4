import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads and displays main content correctly", async ({ page }) => {
    await page.goto("/");

    // Check main heading
    await expect(page.locator("h1")).toContainText("Hei!");
    await expect(page.getByRole("heading", { name: "Hei!" })).toBeVisible({
      timeout: 10000,
    });

    // Check subheading
    await expect(
      page.getByTestId("fade-in").getByRole("heading", { level: 2 }),
    ).toContainText("Jeg heter Daniel Fjeldstad og er en webutvikler.");
    await expect(
      page.getByRole("heading", { name: "Jeg heter Daniel Fjeldstad og" }),
    ).toBeVisible();

    // Check skills text
    await expect(
      page.getByText(
        "Jeg kan Next.js, Javascript, Typescript, React, Vue, PHP, WordPress og mye mer.",
      ),
    ).toBeVisible();

    // Check if icons are visible
    await expect(page.getByTestId("icons")).toBeVisible();
  });

  test("displays 'Om Meg' section correctly", async ({ page }) => {
    await page.goto("/");

    const omMegSection = page.getByLabel("Om Meg");

    // Check section title
    await expect(omMegSection.getByTestId("sanity-title")).toContainText(
      "Om Meg",
      { timeout: 10000 },
    );

    // Check section content
    await expect(omMegSection.getByTestId("fade-in-scroll")).toContainText(
      "I over 10 år har jeg hatt en lidenskap for webutvikling og design, og ser i dag på meg selv som en dedikert senior frontendutvikler.Jeg har jobbet mye med WordPress og WooCommerce, hvor jeg siden 2011 har levert kvalitetsarbeid som frilanser på Fiverr, og har oppnådd 100% positive tilbakemeldinger.Språk som moderne Javascript (ES6+) og Typescript, og populære rammeverk som React, Vue 2/3, Next.js og Sveltekit er noe jeg bruker hver dag. Jeg har også erfaring med PHP, mySQL, GraphQL, Docker, Storybook, Sanity.io, Jest, Cypress, Python og Bootstrap.",
    );
  });

  test("displays 'Prosjekter' section correctly", async ({ page }) => {
    await page.goto("/");

    const prosjekterSection = page.getByLabel("Prosjekter");

    // Check section content
    await expect(
      prosjekterSection.getByTestId("fade-in-scroll"),
    ).toContainText(
      "Jeg har de siste årene hatt mye fokus på AI i form av bruk av og programmering av ulike AI verktøy, boter og applikasjoner. Jeg er også svært aktiv i flere AI miljøer på Discord hvor jeg er administrator på flere servere med totalt over 500 medlemmer, og opererer også som teknisk ansvarlig og utvikler av AI boter og verktøy som brukes på serverne. Holder også på mye med utvikling på GITHUB på hobbybasis, hvor jeg kan skilte med å være Norges mest aktive utvikler.På PROSJEKTER kan du se eksempler på arbeid jeg har gjort i nyere tid.Har også bidratt med utvikling av flere open-source prosjekter på GITHUB.",
      { timeout: 10000 },
    );
  });
});
