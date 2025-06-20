import React from "react";
import { render, screen } from "@testing-library/react";
import { mockIntersectionObserver } from "jsdom-testing-mocks";

import ProsjektCard from "@/components/Prosjekter/ProsjektCard.component";
import type { Project } from "@/types/sanity.types";

mockIntersectionObserver();

interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

jest.mock("@/components/UI/Button.component", () => {
  return function MockButton({ href, children }: ButtonProps) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("@/lib/sanity/client", () => ({
  urlFor: jest.fn().mockReturnValue({
    width: jest.fn().mockReturnThis(),
    height: jest.fn().mockReturnThis(),
    fit: jest.fn().mockReturnThis(),
    quality: jest.fn().mockReturnThis(),
    auto: jest.fn().mockReturnThis(),
    url: jest.fn().mockReturnValue("/test-image.jpg"), // The URL the tests expect
  }),
}));

const mockProjectProps: Project = {
  _id: "1",
  _type: "project",
  _createdAt: "2024-01-23",
  _updatedAt: "2024-01-23",
  _rev: "rev1",
  id: 1,
  name: "Test Project",
  description: "This is a test project",
  subdescription: "This is a subdescription",
  // Use a valid Sanity image object structure
  projectimage: {
    _type: "image",
    asset: {
      _ref: "image-abcde12345-100x100-jpg",
      _type: "reference",
    },
  },
  urlwww: [{ url: "https://example.com", _key: "1", _type: "link" }],
  urlgithub: [{ url: "https://github.com/example", _key: "1", _type: "link" }],
};

describe("ProsjektCard", () => {
  describe("rendering project content", () => {
    it("renders basic project information", () => {
      // Arrange
      const expectedContent = {
        name: "Test Project",
        description: "This is a test project",
        subdescription: "This is a subdescription",
      };

      // Act
      render(<ProsjektCard {...mockProjectProps} />);

      // Assert
      expect(screen.getByText(expectedContent.name)).toBeInTheDocument();
      expect(screen.getByText(expectedContent.description)).toBeInTheDocument();
      expect(
        screen.getByText(expectedContent.subdescription),
      ).toBeInTheDocument();
    });

    it("renders project image with correct attributes", () => {
      // Arrange
      const expectedImage = {
        alt: "Test Project",
        src: "/test-image.jpg",
      };

      // Act
      render(<ProsjektCard {...mockProjectProps} />);
      const img = screen.getByAltText(expectedImage.alt);

      // Assert
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", expectedImage.src);
    });

    it("renders navigation buttons with correct hrefs", () => {
      // Arrange
      const expectedLinks = {
        visit: {
          text: "Besøk",
          href: "https://example.com",
        },
        github: {
          text: "GitHub",
          href: "https://github.com/example",
        },
      };

      // Act
      render(<ProsjektCard {...mockProjectProps} />);

      // Assert
      const visitLink = screen.getByRole("link", {
        name: expectedLinks.visit.text,
      });
      const githubLink = screen.getByRole("link", {
        name: expectedLinks.github.text,
      });

      expect(visitLink).toBeInTheDocument();
      expect(visitLink).toHaveAttribute("href", expectedLinks.visit.href);
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute("href", expectedLinks.github.href);
    });
  });

  describe("conditional rendering", () => {
    it("does not render navigation buttons when urls are not provided", () => {
      // Arrange
      const propsWithoutUrls: Project = {
        ...mockProjectProps,
        urlwww: [],
        urlgithub: [],
      };
      const buttonTexts = ["Besøk", "GitHub"];

      // Act
      render(<ProsjektCard {...propsWithoutUrls} />);

      // Assert
      buttonTexts.forEach((text) => {
        expect(screen.queryByText(text)).not.toBeInTheDocument();
      });
    });
  });
});
