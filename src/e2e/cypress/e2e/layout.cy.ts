/// <reference types="cypress"/>

describe("Layout", () => {
  beforeEach(() => {
    cy.viewport("iphone-x"); // Set mobile viewport
    cy.visit("http://localhost:3000");
  });

  describe("Mobile Menu", () => {
    it("should close when clicking a link", () => {
      // Open the mobile menu
      cy.get('[data-testid="mobilemenu"]').click();

      // Verify menu is visible
      cy.get('[data-testid="mobile-menu"]').should("be.visible");

      // Click a link in the menu
      cy.get('[data-testid="mobil-Prosjekter"]').click();

      // Menu should not be visible after clicking a link
      cy.get('[data-testid="mobile-menu"]').should("not.exist");
    });
  });
});
