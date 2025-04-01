import { test, expect } from "@playwright/test";

test.describe("Prosjekter page", () => {
  test("loads and displays main content correctly", async ({ page }) => {
    await page.goto("/prosjekter");

    // Check main heading
    await expect(
      page.getByRole("heading", { name: "Prosjekter" }),
    ).toBeVisible();

    // Check if 'Dfweb versjon' heading is visible
    await expect(
      page.getByRole("heading", { name: "Dfweb versjon" }),
    ).toBeVisible();
  });

  test("displays project images correctly", async ({ page }) => {
    await page.goto("/prosjekter");

    // Check if project images are visible
    await expect(page.getByRole("img", { name: "Earth Doom" })).toBeVisible();
    await expect(
      page.getByRole("img", { name: "NextJS WooCommerce" }),
    ).toBeVisible();
  });

  test("displays project details correctly", async ({ page }) => {
    await page.goto("/prosjekter");

    const portfolioContent = page.getByLabel("Innhold portefølje");

    // Check project title
    await expect(portfolioContent).toContainText("Earth Doom");

    // Check project description
    await expect(portfolioContent).toContainText(
      "ProsjekterEarth DoomFullstack utviklet i Next.js strategispill inspirert av Planetarion. Prosjektet inkluderer innlogging, database, grafer, responsivt design med mer. Next.js, Typescript, Tailwind, Prisma, Clerk, tRPC, PostgreSQL, Chart.jsBesøkGitHubFrisørsalong BookingsystemFullstack bookingsystem for frisørsalonger med NestJS og Vue 3. Statusvisning for TV. Bestilling av klipp med automatisk tilgjengelighetssjekk. Administrasjonspanel for booking- og ansatthåndtering.NestJS, Vue 3, TypeScript, PostgreSQL, JWT, TypeORM, Tailwind CSS, DockerGitHubNextJS WooCommerceNettbutikk med Next.js og WooCommerce som backend. Produktene hentes via GraphQL. Produktsøk via Algolia og egenutviklet plugin. Formvalidering gjøres via native HTML5.Typescript, Next.js, Algolia, Tailwind, React Hook FormBesøkGitHubLO - Partiene SvarerValgomat for LO. Frontend er lagd i Vue 2. Styling via SCSS. Backend er hentet fra CMS-løsningen til LO i Episerver.Vue 2, SCSS, EpiserverBesøkDfweb versjon 4Matrix-inspirert portefølje er utviklet med Next.js og Typescript. Animasjoner er implementert via Framer motion. Design med Tailwind CSS. Form med React Hook Form. Data hentes fra Sanity.Next.js, Typescript, Sanity, Framer Motion, Ladle, Tailwind, React Hook FormBesøkGitHubWP Algolia Woo IndexerPlugin for å sende WooCommerce-produkter til Algolia. Pluginen er kodet i PHP 8 og inkluderer oversettelser via .PO og .MO filer. Koden er testet i PHPCS.WordPress, PHP, OOP, PHPCS, POTGitHubNuxtJS WooCommerceNettbutikk med Nuxt 3 og Vue 3. Produktene hentes fra WooCommerce. Søk via egenutviklet Algolia plugin. Formvalidering via Formkit, Vee Validate og Yup.Vue 3, Nuxt 3, Tailwind, Formkit, AlgoliaBesøkGitHubNettbutikk i Laravel og Vue 3Nettbutikk med Laravel 10 og Vue 3. Formhåndtering med Formkit. Statehåndtering via Pinia. Stripe for betaling. Innebygd Laravel søk. Bruker PostgreSQL database til backend.Laravel, Vue, Formkit, Pinia, Tailwind, Stripe, PostgreSQLGitHub",
    );

    // Check project technologies
    await expect(portfolioContent).toContainText(
      "Typescript, Tailwind, Prisma, Clerk, tRPC, PostgreSQL, Chart.js",
    );

    // Check if 'Besøk' and 'GitHub' links are visible
    await expect(page.getByText("BesøkGitHub").first()).toBeVisible();
  });
});
