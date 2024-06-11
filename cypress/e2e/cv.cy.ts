/// <reference types="cypress"/>
/// <reference types="cypress-axe"/>
/// <reference types="axe-core"/>

import { checkAccessibility } from "../support/functions";

describe("Test at CV vises og laster", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/cv");
  });

  it("Se at CV vises", () => {
    cy.get("main#maincontent").should("be.visible");
    cy.get('.container img[alt="CV"]')
      .should("have.length", 2)
      .and("be.visible");
    cy.get('a[href="./cv.pdf"]').should("be.visible");
  });

  it("CV skal ikke ha noen a11y feilmeldinger", () => {
    // Vent på at animasjonene skal bli ferdige før vi tester
    checkAccessibility(5000);
  });
});
