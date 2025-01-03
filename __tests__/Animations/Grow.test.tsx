/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Grow from "../../src/components/Animations/Grow.component";

describe("Grow", () => {
  describe("with provided props", () => {
    beforeEach(() => {
      render(
        <Grow duration={0.3} delay={0.2} easing={[0.42, 0, 0.58, 1]}>
          Hello World
        </Grow>,
      );
    });

    test("Kan vise komponenten", () => {
      expect(screen.getByTestId("grow")).toBeInTheDocument();
    });

    test("Legger til riktige animasjoner", () => {
      const element = screen.getByTestId("grow");
      expect(element).toHaveStyle("transform: scale(0);");
    });

    test("Viser children", () => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });
  });

  describe("with default props", () => {
    beforeEach(() => {
      render(<Grow>Default Props Test</Grow>);
    });

    test("renders with default values", () => {
      const element = screen.getByTestId("grow");
      expect(element).toBeInTheDocument();
      expect(screen.getByText("Default Props Test")).toBeInTheDocument();
    });
  });
});
