/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { mockIntersectionObserver } from "jsdom-testing-mocks";

import PageTransition from "../../src/components/Animations/PageTransition.component";
import FadeDown from "../../src/components/Animations/FadeDown.component";
import FadeUp from "../../src/components/Animations/FadeUp.component";
import BounceInScroll from "../../src/components/Animations/BounceInScroll.component";

mockIntersectionObserver();

type AnimationComponent =
  | typeof PageTransition
  | typeof FadeDown
  | typeof FadeUp
  | typeof BounceInScroll;

/**
 * Reusable tests for animation components.
 *
 * @param {AnimationComponent} Component - The animation component to test.
 * @param {string} testId - The test ID for the component.
 * @param {string} expectedAttribute - The expected attribute value for the component.
 * @return {void} This function does not return anything.
 */
function testAnimationComponent(
  Component: AnimationComponent,
  testId: string,
  expectedAttribute: string,
) {
  describe(Component.name, () => {
    beforeEach(() => {
      render(<Component delay={1}>{Component.name}</Component>);
    });

    it(`${Component.name} loads and can be displayed`, () => {
      const element = screen.getByTestId(testId);
      expect(element).toBeInTheDocument();
    });

    it(`Framer motion sets ${expectedAttribute}`, () => {
      const element = screen.getByTestId(testId);
      expect(element).toContainHTML(expectedAttribute);
    });
  });
}

testAnimationComponent(PageTransition, "pagetransition", "opacity: 0");
testAnimationComponent(FadeDown, "fadedown", "translateY");
testAnimationComponent(FadeUp, "fadeup", "translateY");
testAnimationComponent(BounceInScroll, "bounceinscroll", "translateY");
