/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";

import Icons from "@/components/Index/Icons.component";

interface IconTest {
  name: string;
  selector: () => HTMLElement;
}

describe("Icons", () => {
  const testCases: IconTest[] = [
    { name: "React", selector: () => screen.getByLabelText(/react ikon/i) },
    { name: "Vue", selector: () => screen.getByLabelText(/vuejs/i) },
    {
      name: "TypeScript",
      selector: () => screen.getByRole("img", { name: /typescript ikon/i }),
    },
    {
      name: "WordPress",
      selector: () => screen.getByRole("img", { name: /wordpress ikon/i }),
    },
    { name: "PHP", selector: () => screen.getByLabelText(/php ikon/i) },
  ];

  testCases.forEach(({ name, selector }) => {
    it(`renders ${name} icon correctly`, () => {
      // Arrange
      const expectedIcon = selector;

      // Act
      render(<Icons />);
      const icon = expectedIcon();

      // Assert
      expect(icon).toBeInTheDocument();
    });
  });
});
