/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { mockIntersectionObserver } from "jsdom-testing-mocks";

import PageTransition from "@/components/Animations/PageTransition.component";
import FadeDown from "@/components/Animations/FadeDown.component";
import FadeUp from "@/components/Animations/FadeUp.component";
import BounceInScroll from "@/components/Animations/BounceInScroll.component";

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
    // Arrange - Set up test data and conditions
    const testContent = Component.name;
    let renderedComponent: ReturnType<typeof render>;

    beforeEach(() => {
      // Act - Perform the action being tested
      renderedComponent = render(<Component delay={1}>{testContent}</Component>);
    });

    it(`${Component.name} loads and can be displayed`, () => {
      // Arrange - Set up test data and conditions
      const expectedTestId = testId;

      // Act - Perform the action being tested
      const element = screen.getByTestId(expectedTestId);

      // Assert - Verify the results
      expect(element).toBeInTheDocument();
    });

    it(`Framer motion sets ${expectedAttribute}`, () => {
      // Arrange - Set up test data and conditions
      const expectedTestId = testId;

      // Act - Perform the action being tested
      const element = screen.getByTestId(expectedTestId);

      // Assert - Verify the results
      expect(element).toContainHTML(expectedAttribute);
    });
  });
}

testAnimationComponent(PageTransition, "pagetransition", "opacity: 0");
testAnimationComponent(FadeDown, "fadedown", "translateY");
testAnimationComponent(FadeUp, "fadeup", "translateY");
testAnimationComponent(BounceInScroll, "bounceinscroll", "translateY");
