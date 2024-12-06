/// <reference types="cypress"/>

import Hero from "../../src/components/Index/Hero.component";
import type { Herocontent } from "../../src/types/sanity.types";

const content: (Herocontent & { _key: string })[] = [
  {
    _type: "herocontent",
    _key: "hero1",
    text: "Hei!",
  },
  {
    _type: "herocontent",
    _key: "hero2",
    text: "Jeg heter Daniel Fjeldstad og er en webutvikler.",
  },
  {
    _type: "herocontent",
    _key: "hero3",
    text: "Jeg kan PHP, Wordpress, Javascript, Typescript, React, Vue, Docker, Photoshop og mye mer.",
  },
];

it("Viser Hero komponentt", () => {
  cy.mount(<Hero content={content} />);
  cy.contains("Hei!").should("be.visible");
});

it("Viser PHP tekst", () => {
  cy.mount(<Hero content={content} />);
  cy.contains("PHP").should("be.visible");
});
