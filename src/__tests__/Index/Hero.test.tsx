/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Hero from "@/components/Index/Hero.component";
import type { Herocontent } from "@/types/sanity.types";
import heromock from "./fixtures/hero.json";

describe("Hero", () => {
  it("Hero loads and displays content from mock", () => {
    // Arrange
    const mockContent = heromock.content as ({ _key: string } & Herocontent)[];

    // Act
    render(<Hero content={mockContent} />);
    const hero = screen.getByText(/hei!/i);

    // Assert
    expect(hero).toBeInTheDocument();
  });

  it("renders default text when content array is empty", () => {
    // Arrange
    const emptyContent: ({ _key: string } & Herocontent)[] = [];
    const expectedText = "Hei!";

    // Act
    render(<Hero content={emptyContent} />);
    const hero = screen.getByText(expectedText);

    // Assert
    expect(hero).toBeInTheDocument();
  });
});
