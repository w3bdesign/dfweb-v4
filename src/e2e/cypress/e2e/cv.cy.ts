/// <reference types="cypress"/>
/// <reference types="cypress-axe"/>
/// <reference types="axe-core"/>

import { checkAccessibility } from "../support/functions";

describe("Test at CV vises og laster", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/cv");
  });

  it("Se at CV vises", () => {
    cy.get("#maincontent").should("be.visible");
    cy.get("#tab-qualifications").should("have.length", 1).and("be.visible");
  });

  it("CV skal ikke ha noen a11y feilmeldinger", () => {
    // Vent på at animasjonene skal bli ferdige før vi tester
    checkAccessibility(5000);
  });
});
