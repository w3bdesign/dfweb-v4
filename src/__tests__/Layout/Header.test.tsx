/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import Header from "@/components/Layout/Header.component";

// Mock the usePathname hook
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock the MobileMenu component
jest.mock("@/components/Layout/MobileMenu.component", () => {
  return function MockMobileMenu() {
    return <div data-testid="mobile-menu">Mobile Menu</div>;
  };
});

describe("Header", () => {
  const mockNavigationLinks = [
    { _key: "home", name: "Hjem", href: "/", title: "Hjem", hash: "", externalLink: false },
    {
      _key: "projects",
      name: "Prosjekter",
      href: "/prosjekter",
      title: "Prosjekter",
      hash: "",
      externalLink: false,
    },
    { _key: "cv", name: "CV", href: "/cv", title: "CV", hash: "", externalLink: false },
    {
      _key: "contact",
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
      render(<Header navigation={{
        _id: "mock-nav",
        _type: "navigation",
        _createdAt: "2024-01-01",
        _updatedAt: "2024-01-01",
        _rev: "mock-rev",
        links: mockNavigationLinks
      }} />);
      const header = screen.getByRole(expectedRole);

      // Assert
      expect(header).toBeInTheDocument();
    });

    it("renders all navigation links with correct attributes", () => {
      // Arrange
      render(<Header navigation={{
        _id: "mock-nav",
        _type: "navigation",
        _createdAt: "2024-01-01",
        _updatedAt: "2024-01-01",
        _rev: "mock-rev",
        links: mockNavigationLinks
      }} />);

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
      render(<Header navigation={{
        _id: "mock-nav",
        _type: "navigation",
        _createdAt: "2024-01-01",
        _updatedAt: "2024-01-01",
        _rev: "mock-rev",
        links: mockNavigationLinks
      }} />);
      const mobileMenu = screen.getByTestId(expectedTestId);

      // Assert
      expect(mobileMenu).toBeInTheDocument();
    });
  });
});
