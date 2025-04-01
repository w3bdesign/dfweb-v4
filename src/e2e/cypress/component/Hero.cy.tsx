/// <reference types="cypress"/>

import Hero from "@/components/Index/Hero.component";

const content = [
  {
    text: "Hei!",
  },
  {
    text: "Jeg heter Daniel Fjeldstad og er en webutvikler.",
  },
  {
    text: "Jeg kan Next.js, Javascript, Typescript, React, Vue, PHP, WordPress og mye mer.",
  },
];

it("Viser Hero komponent", () => {
  cy.mount(<Hero content={content} />);
  cy.contains("Hei!").should("be.visible");
});

it("Viser PHP tekst", () => {
  cy.mount(<Hero content={content} />);
  cy.contains("PHP").should("be.visible");
});
