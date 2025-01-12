/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";

import MobileMenu from "@/components/Layout/MobileMenu.component";
import linksmock from "../../__mocks__/links.json";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("MobileMenu - elementer eksisterer", () => {
  const testidMenu = "mobile-menu";

  beforeEach(() => {
    // Default to home page
    mockUsePathname.mockReturnValue("/");
    render(<MobileMenu links={linksmock} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    expect(
      screen.getByRole("button", { name: /hamburger/i, expanded: false }),
    ).toBeInTheDocument();

    // Act - Open menu
    fireEvent.click(hamburger);

    // Assert - Open state
    expect(
      screen.getByRole("button", { name: /hamburger/i, expanded: true }),
    ).toBeInTheDocument();

    // Act - Close menu
    fireEvent.click(hamburger);

    // Assert - Closed state
    expect(
      screen.getByRole("button", { name: /hamburger/i, expanded: false }),
    ).toBeInTheDocument();
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

  it("renders internal links with correct active state", () => {
    // Arrange
    cleanup(); // Clean up previous renders
    const currentPath = "/prosjekter";
    mockUsePathname.mockReturnValue(currentPath);
    const { getByTestId } = render(<MobileMenu links={linksmock} />);
    const hamburger = getByTestId("hamburger");

    // Act
    fireEvent.click(hamburger);

    // Assert
    linksmock.forEach(link => {
      if (!link.externalLink) {
        const linkElement = screen.getByTestId(`mobil-${link.name}`);
        if (link.href === currentPath) {
          expect(linkElement).toHaveClass("text-green-400");
          const underline = linkElement.querySelector("span");
          expect(underline).toHaveClass("bg-green-400");
        } else {
          expect(linkElement).not.toHaveClass("text-green-400");
          const underline = linkElement.querySelector("span");
          expect(underline).toHaveClass("bg-white");
        }
      }
    });
  });

  it("renders internal links with glitch effect", () => {
    // Arrange
    const hamburger = screen.getByTestId("hamburger");

    // Act
    fireEvent.click(hamburger);

    // Assert
    linksmock.forEach(link => {
      if (!link.externalLink) {
        const linkElement = screen.getByTestId(`mobil-${link.name}`);
        const glitchElement = linkElement.querySelector(".glitch");
        expect(glitchElement).toBeInTheDocument();
        expect(glitchElement).toHaveAttribute("data-text", link.name);
      }
    });
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
    expect(screen.getByTestId("hamburger")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
