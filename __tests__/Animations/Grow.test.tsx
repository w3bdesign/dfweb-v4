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

    it("renders component with custom animation props", () => {
      // Arrange
      const expectedTestId = "grow";
      
      // Act
      const element = screen.getByTestId(expectedTestId);
      
      // Assert
      expect(element).toBeInTheDocument();
    });

    it("applies initial scale transform animation", () => {
      // Arrange
      const expectedStyle = "transform: scale(0);";
      
      // Act
      const element = screen.getByTestId("grow");
      
      // Assert
      expect(element).toHaveStyle(expectedStyle);
    });

    it("renders children content", () => {
      // Arrange
      const expectedContent = "Hello World";
      
      // Act
      const content = screen.getByText(expectedContent);
      
      // Assert
      expect(content).toBeInTheDocument();
    });
  });

  describe("with default props", () => {
    it("renders component with default animation values", () => {
      // Arrange
      const expectedContent = "Default Props Test";
      
      // Act
      render(<Grow>{expectedContent}</Grow>);
      const element = screen.getByTestId("grow");
      const content = screen.getByText(expectedContent);
      
      // Assert
      expect(element).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });
  });
});
