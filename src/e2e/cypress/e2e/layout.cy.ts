/// <reference types="cypress"/>

describe("Layout", () => {
  beforeEach(() => {
    cy.viewport('iphone-x'); // Set mobile viewport
    cy.visit("http://localhost:3000");
  });

  describe("Mobile Menu", () => {
    it("should close when clicking outside the nav element", () => {
      // Open the mobile menu
      cy.get('[data-testid="mobilemenu"]').click();
      
      // Verify menu is visible
      cy.get('[data-testid="mobile-menu"]').should('be.visible');
      
      // Click on the menu background (outside nav but inside motion.div)
      // This should fail with ref on motion.div, but pass when ref is on nav
      cy.get('[data-testid="mobile-menu"]').click('topRight', { force: true });
      
      // Menu should NOT be visible (passing test)
      // because clicking outside the nav should close the menu
      cy.get('[data-testid="mobile-menu"]').should('not.be.visible');
    });
  });
});
