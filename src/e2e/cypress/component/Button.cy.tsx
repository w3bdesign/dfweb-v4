/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import Button from "@/components/UI/Button.component";
import "@testing-library/cypress/add-commands";

// https://larsmagnus.co/blog/component-testing-with-cypress-in-next-js

describe("<Button>", () => {
  it("mounts", () => {
    cy.mount(<Button>Test</Button>);
    cy.get("[data-cy=submit]").should("have.text", "Test");
  });

  // Test href prop
  it("navigates when clicked if href provided", () => {
    cy.mount(<Button href="https://example.com">Button</Button>);
    cy.findByRole("link", { name: "Button" }).click();
    cy.url().should("include", "example.com");
  });

  it("renders as submit button", () => {
    cy.mount(<Button type="submit">Button</Button>);
    cy.get('button[type="submit"]').should("exist");
  });

  it("renders as reset button", () => {
    cy.mount(<Button type="reset">Button</Button>);
    cy.get('button[type="reset"]').should("exist");
  });
});
