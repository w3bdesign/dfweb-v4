/// <reference types="cypress"/>
/// <reference types="cypress-axe"/>
/// <reference types="axe-core"/>

import { checkAccessibility } from "../support/functions";

describe("Prosjekter Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/prosjekter");
  });

  it("should load the prosjekter page", () => {
    cy.url().should("include", "/prosjekter");
    cy.get("h1").should("contain", "Prosjekter"); // Assumption: there is an h1 element with the text 'Prosjekter'
  });

  it("should display project cards", () => {
    cy.get(".bg-white.shadow-md.rounded-lg.overflow-hidden").should(
      "have.length.at.least",
      1
    );
  });

  it("should display project name, description, and subdescription", () => {
    cy.get(".bg-white.shadow-md.rounded-lg.overflow-hidden")
      .first()
      .within(() => {
        cy.get("h1").should("have.class", "text-xl").and("not.be.empty");
        cy.get("h2").should("have.class", "text-gray-600").and("not.be.empty");
        cy.get("p").should("have.class", "text-gray-500").and("not.be.empty");
      });
  });

  it('should have functioning "Besøk" button if urlwww exists', () => {
    cy.get(".bg-white.shadow-md.rounded-lg.overflow-hidden")
      .first()
      .within(() => {
        cy.get("a")
          .contains("Besøk")
          .should("have.attr", "href")
          .and("not.be.empty");
      });
  });

  it('should have functioning "GitHub" button if urlgithub exists', () => {
    cy.get(".bg-white.shadow-md.rounded-lg.overflow-hidden")
      .first()
      .within(() => {
        cy.get("a")
          .contains("GitHub")
          .should("have.attr", "href")
          .and("not.be.empty");
      });
  });

  it('should have the correct URL for "GitHub" button', () => {
    cy.get(".bg-white.shadow-md.rounded-lg.overflow-hidden")
      .first()
      .within(() => {
        cy.get("a")
          .contains("GitHub")
          .should("have.attr", "href")
          .and("match", /^https:\/\/github\.com/);
      });
  });

  it("Kontakt skal ikke ha noen a11y feilmeldinger", () => {
    checkAccessibility(5000);
  });
});
