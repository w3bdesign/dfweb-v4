import React from "react";
import { render, screen } from "@testing-library/react";

import ProsjektCard from "../../src/components/Prosjekter/ProsjektCard";

// Mock the Button component
jest.mock(
  "../../src/components/UI/Button.component",
  () =>
    ({ href, renderAs, children }) => <a href={href}>{children}</a>,
);

const mockProjectProps = {
  id: "1",
  name: "Test Project",
  description: "This is a test project",
  subdescription: "This is a subdescription",
  projectimage: "test-image.jpg",
  urlwww: [{ url: "https://example.com", _key: "1" }],
  urlgithub: [{ url: "https://github.com/example", _key: "1" }],
};

describe("ProsjektCard", () => {
  it("renders the project details correctly", () => {
    render(<ProsjektCard {...mockProjectProps} />);

    // Check if the project name is rendered
    expect(screen.getByText("Test Project")).toBeInTheDocument();

    // Check if the project description is rendered
    expect(screen.getByText("This is a test project")).toBeInTheDocument();

    // Check if the project subdescription is rendered
    expect(screen.getByText("This is a subdescription")).toBeInTheDocument();

    // Check if the project image is rendered
    const img = screen.getByAltText("Test Project");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "test-image.jpg");

    // Check if the "Besøk" button is rendered with the correct href
    const visitButton = screen.getByText("Besøk");
    expect(visitButton).toBeInTheDocument();
    expect(visitButton.closest("a")).toHaveAttribute(
      "href",
      "https://example.com",
    );

    // Check if the "GitHub" button is rendered with the correct href
    const githubButton = screen.getByText("GitHub");
    expect(githubButton).toBeInTheDocument();
    expect(githubButton.closest("a")).toHaveAttribute(
      "href",
      "https://github.com/example",
    );
  });

  it("does not render buttons if urls are not provided", () => {
    const propsWithoutUrls = {
      ...mockProjectProps,
      urlwww: [],
      urlgithub: [],
    };

    render(<ProsjektCard {...propsWithoutUrls} />);

    // Check that the "Besøk" button is not rendered
    expect(screen.queryByText("Besøk")).not.toBeInTheDocument();

    // Check that the "GitHub" button is not rendered
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
  });
});