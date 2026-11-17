/// <reference types="cypress"/>
/// <reference types="cypress-axe"/>
/// <reference types="axe-core"/>

import { checkAccessibility } from "../support/functions";

/**
 * Smoke + accessibility checks for the contact page.
 * Form submission, validation and network mocking are covered by
 * Playwright in src/e2e/playwright/kontakt.spec.ts (see DOCS/TEST-STRATEGY.md).
 */
describe("Kontakt", () => {
  const beVisible = "be.visible";

  beforeEach(() => {
    cy.visit("http://localhost:3000/kontakt");
  });

  it("Kontaktsiden laster med skjema og alle felt", () => {
    cy.title().should("eq", "Kontakt - Dfweb");
    cy.get("form[aria-label='Contact Form']").should(beVisible);
    cy.get("#navn").should(beVisible);
    cy.get("#telefon").should(beVisible);
    cy.get("#tekst").should(beVisible);
    cy.get("[data-testid='submit-button']")
      .should(beVisible)
      .and("contain.text", "Send skjema");
  });

  it("Kontakt skal ikke ha noen a11y feilmeldinger", () => {
    checkAccessibility(5000);
  });
});
