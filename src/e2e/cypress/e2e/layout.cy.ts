/// <reference types="cypress"/>
import "@testing-library/cypress/add-commands";

describe("Layout", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.visit("http://localhost:3000");
  });

  describe("Mobile Menu", () => {
    it("should close when clicking a link", () => {
      // Open the mobile menu
      cy.findByTestId("mobilemenu").click();

      // Verify menu is visible
      cy.findByTestId("mobile-menu").should("be.visible");

      // Click a link in the menu
      cy.findByTestId("mobil-Prosjekter").click();

      // Menu should not be visible after clicking a link
      cy.findByTestId("mobile-menu").should("not.exist");
    });
  });
});
