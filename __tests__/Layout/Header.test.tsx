/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import Header from "../../src/components/Layout/Header.component";

// Mock the usePathname hook
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock the MobileMenu component
jest.mock("../../src/components/Layout/MobileMenu.component", () => {
  return function MockMobileMenu({ links }: { links: any[] }) {
    return <div data-testid="mobile-menu">Mobile Menu</div>;
  };
});

describe("Header", () => {
  const mockNavigationLinks = [
    { name: "Hjem", href: "/", title: "Hjem", hash: "", externalLink: false },
    {
      name: "Prosjekter",
      href: "/prosjekter",
      title: "Prosjekter",
      hash: "",
      externalLink: false,
    },
    { name: "CV", href: "/cv", title: "CV", hash: "", externalLink: false },
    {
      name: "Kontakt",
      href: "/kontakt",
      title: "Kontakt",
      hash: "",
      externalLink: false,
    },
  ];

  describe("rendering", () => {
    it("renders header container", () => {
      // Arrange
      const expectedRole = "banner";
      
      // Act
      render(<Header navigationLinks={mockNavigationLinks} />);
      const header = screen.getByRole(expectedRole);
      
      // Assert
      expect(header).toBeInTheDocument();
    });

    it("renders all navigation links with correct attributes", () => {
      // Arrange
      render(<Header navigationLinks={mockNavigationLinks} />);
      
      // Act & Assert
      mockNavigationLinks.forEach((link) => {
        const linkElement = screen.getByText(link.name);
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.closest("a")).toHaveAttribute("href", link.href);
      });
    });

    it("renders mobile menu component", () => {
      // Arrange
      const expectedTestId = "mobile-menu";
      
      // Act
      render(<Header navigationLinks={mockNavigationLinks} />);
      const mobileMenu = screen.getByTestId(expectedTestId);
      
      // Assert
      expect(mobileMenu).toBeInTheDocument();
    });
  });
});
