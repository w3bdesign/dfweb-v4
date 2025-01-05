/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MobileMenu from "@/components/Layout/MobileMenu.component";

import linksmock from "../../__mocks__/links.json";

describe("MobileMenu - elementer eksisterer", () => {
  const testidMenu = "mobile-menu";

  beforeEach(() => {
    render(<MobileMenu links={linksmock} />);
  });

  it("renders mobile menu when hamburger is clicked", () => {
    // Arrange
    const hamburger = screen.getByTestId("hamburger");
    
    // Act
    fireEvent.click(hamburger);
    const mobilemenu = screen.getByTestId(testidMenu);
    
    // Assert
    expect(mobilemenu).toBeInTheDocument();
  });

  it("toggles hamburger menu expansion state", () => {
    // Arrange
    const hamburger = screen.getByTestId("hamburger");
    
    // Assert - Initial state
    expect(screen.getByRole("button", { name: /hamburger/i, expanded: false }))
      .toBeInTheDocument();
    
    // Act - Open menu
    fireEvent.click(hamburger);
    
    // Assert - Open state
    expect(screen.getByRole("button", { name: /hamburger/i, expanded: true }))
      .toBeInTheDocument();
    
    // Act - Close menu
    fireEvent.click(hamburger);
    
    // Assert - Closed state
    expect(screen.getByRole("button", { name: /hamburger/i, expanded: false }))
      .toBeInTheDocument();
  });

  it("displays correct number of navigation links", () => {
    // Arrange
    const hamburger = screen.getByTestId("hamburger");
    
    // Act
    fireEvent.click(hamburger);
    const menuItems = screen.getAllByRole("link");
    
    // Assert
    expect(menuItems.length).toBe(linksmock.length);
  });

  it("opens external links in new tab with correct attributes", () => {
    // Arrange
    const hamburger = screen.getByTestId("hamburger");
    
    // Act
    fireEvent.click(hamburger);
    const externalLink = screen.getByRole("link", { name: /github/i });
    
    // Assert
    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noreferrer");
  });

  it("closes menu when clicking outside", async () => {
    // Arrange
    const user = userEvent.setup();
    const hamburger = screen.getByTestId("hamburger");
    
    // Act - Open menu
    await user.click(hamburger);
    
    // Assert - Menu is open
    expect(screen.getByTestId(testidMenu)).toBeInTheDocument();
    
    // Act - Close menu
    await user.click(document.body);
    
    // Assert - Menu is closed
    expect(screen.getByTestId("hamburger")).toHaveAttribute("aria-expanded", "false");
  });
});
