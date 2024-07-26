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
    { name: "Prosjekter", href: "/prosjekter", title: "Prosjekter", hash: "", externalLink: false },
    { name: "CV", href: "/cv", title: "CV", hash: "", externalLink: false },
    { name: "Kontakt", href: "/kontakt", title: "Kontakt", hash: "", externalLink: false },
  ];

  it("renders Header with navigation links", () => {
    render(<Header navigationLinks={mockNavigationLinks} />);
    
    // Check if the header is in the document
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    // Check if all navigation links are rendered
    mockNavigationLinks.forEach((link) => {
      const linkElement = screen.getByText(link.name);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest('a')).toHaveAttribute('href', link.href);
    });

    // Check if the mobile menu is rendered
    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeInTheDocument();
  });
});