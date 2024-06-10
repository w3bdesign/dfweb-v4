/// <reference types="cypress"/>

// https://cheatography.com/aiqbal/cheat-sheets/cypress-io/
describe("Forside", () => {
  beforeEach(() => {
    //cy.visit("/");
    // Local:
    cy.visit("http://localhost:3000");
  });

  it(`Hei vises på forsiden`, () => {
    cy.get('[data-cy="hei"]').contains("Hei!");
  });

  it(`Om meg vises på forsiden`, () => {
    cy.get('[data-cy="Om Meg"]').contains("Om Meg");
  });

  it(`Prosjekter vises på forsiden`, () => {
    cy.get('[data-cy="Prosjekter"]').contains("Prosjekter");
  });
});

export {};
