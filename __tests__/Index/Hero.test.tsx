/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Hero from "@/components/Index/Hero.component";
import heromock from "../../__mocks__/hero.json";
import { PortableTextBlock } from "@portabletext/types";

describe("Hero", () => {
  it("Hero loads and displays content from mock", () => {
    // Arrange
    const mockContent = heromock.content;
    
    // Act
    render(<Hero content={mockContent} />);
    const hero = screen.getByText(/hei!/i);
    
    // Assert
    expect(hero).toBeInTheDocument();
  });

  it("renders default text when content array is empty", () => {
    // Arrange
    const emptyContent: PortableTextBlock[] = [];
    const expectedText = "Hei!";
    
    // Act
    render(<Hero content={emptyContent} />);
    const hero = screen.getByText(expectedText);
    
    // Assert
    expect(hero).toBeInTheDocument();
  });
});
