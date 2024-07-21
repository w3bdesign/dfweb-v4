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
    cy.get("h1").should("contain", "Prosjekter"); // Assumption: there is an h1 element with the text 'Prosjekter' on the page
  });

  it("should display project cards", () => {
    cy.get('[data-testid="projectcard"]').should("have.length.at.least", 1);
  });

  it("should display project name, description, and subdescription", () => {
    cy.get('[data-testid="projectcard"]')
      .first()
      .within(() => {
        cy.get("h1").should("have.class", "text-xl").and("not.be.empty");
        cy.get("h2").should("have.class", "text-md").and("not.be.empty");
        cy.get("p").should("have.class", "text-sm").and("not.be.empty");
      });
  });

  it('should have functioning "Besøk" button if urlwww exists', () => {
    cy.get('[data-testid="projectcard"]')
      .first()
      .within(() => {
        cy.get("a")
          .contains("Besøk")
          .should("have.attr", "href")
          .and("not.be.empty");
      });
  });

  it('should have functioning "GitHub" button if urlgithub exists', () => {
    cy.get('[data-testid="projectcard"]')
      .first()
      .within(() => {
        cy.get("a")
          .contains("GitHub")
          .should("have.attr", "href")
          .and("not.be.empty");
      });
  });

  it('should have the correct URL for "GitHub" button', () => {
    cy.get('[data-testid="projectcard"]')
      .first()
      .within(() => {
        cy.get("a")
          .contains("GitHub")
          .should("have.attr", "href")
          .and("match", /^https:\/\/github\.com\/.+$/);
      });
  });

  it("Prosjekter page should not have any a11y issues", () => {
    checkAccessibility(5000);
  });
});
