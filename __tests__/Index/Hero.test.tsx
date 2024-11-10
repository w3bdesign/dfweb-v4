/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Hero from "../../src/components/Index/Hero.component";
import heromock from "../../__mocks__/hero.json";

describe("Hero", () => {
  it("Hero laster inn og kan vises", () => {
    render(<Hero content={heromock.content} />);
    const hero = screen.getByText(/hei!/i);
    expect(hero).toBeInTheDocument();
  });

  it("renders default text when content array is empty", () => {
    render(<Hero content={[]} />);
    const hero = screen.getByText("Hei!");
    expect(hero).toBeInTheDocument();
  });
});
