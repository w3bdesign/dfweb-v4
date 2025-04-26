/// <reference types="cypress"/>

import Hero from "@/components/Index/Hero.component";
import type { Herocontent } from "@/types/sanity.types";

const content: Herocontent[] = [
  {
    _type: "herocontent",
    text: "Hei!",
  },
  {
    _type: "herocontent",
    text: "Jeg heter Daniel Fjeldstad og er en webutvikler.",
  },
  {
    _type: "herocontent",
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
