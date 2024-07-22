/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MobileMenu from "../../src/components/Layout/MobileMenu.component";

import linksmock from "../../__mocks__/links.json";

describe("MobileMenu - elementer eksisterer", () => {
  const testidMenu = "mobile-menu";

  beforeEach(() => {
    render(<MobileMenu links={linksmock} />);
  });

  it("MobileMenu laster inn og kan vises", () => {
    // First, click the hamburger to expand the menu
    const hamburger = screen.getByTestId("hamburger");
    fireEvent.click(hamburger);

    // Now we can look for the mobile-menu
    const mobilemenu = screen.getByTestId(testidMenu);
    expect(mobilemenu).toBeInTheDocument();
  });

  it("Ekspanderer hamburger meny", () => {
    const hamburger = screen.getByTestId("hamburger");

    expect(
      screen.getByRole("button", { name: /hamburger/i, expanded: false }),
    ).toBeInTheDocument();

    fireEvent.click(hamburger);

    expect(
      screen.getByRole("button", { name: /hamburger/i, expanded: true }),
    ).toBeInTheDocument();

    fireEvent.click(hamburger);

    expect(
      screen.getByRole("button", { name: /hamburger/i, expanded: false }),
    ).toBeInTheDocument();
  });

  it("Viser riktig antall linker", () => {
    const hamburger = screen.getByTestId("hamburger");

    fireEvent.click(hamburger);

    const menuItems = screen.getAllByRole("link");

    expect(menuItems.length).toBe(linksmock.length);
  });

  it("Åpner eksterne linker i ny fane", () => {
    const hamburger = screen.getByTestId("hamburger");

    fireEvent.click(hamburger);

    const externalLink = screen.getByRole("link", { name: /github/i });

    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noreferrer");
  });

  it("Lukker menyen", async () => {
    const user = userEvent.setup();
    const hamburger = screen.getByTestId("hamburger");

    // Open the menu
    await user.click(hamburger);

    expect(screen.getByTestId(testidMenu)).toBeInTheDocument();

    // Click outside the menu
    await user.click(document.body);

    // Check if the menu is closed
    expect(screen.getByTestId("hamburger")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
