import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Prosjekter from "@/app/prosjekter/page";
import { getProjects, preloadProjects } from "@/app/prosjekter/actions";
import type { Project } from "@/types/sanity.types";

jest.mock("@/app/prosjekter/actions", () => ({
  getProjects: jest.fn(),
  preloadProjects: jest.fn(),
}));

const mockGetProjects = jest.mocked(getProjects);
const mockPreloadProjects = jest.mocked(preloadProjects);

const createProject = (id: number, name: string): Project => ({
  _id: `project-${id}`,
  _type: "project",
  _createdAt: "2026-01-01T00:00:00Z",
  _updatedAt: "2026-01-01T00:00:00Z",
  _rev: `revision-${id}`,
  id,
  name,
});

jest.mock("@/components/UI/PageHeader.component", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

jest.mock("@/components/Prosjekter/ProsjektCard.component", () => ({
  __esModule: true,
  default: ({ name, staggerDelay }: { name: string; staggerDelay: number }) => (
    <article data-testid="project-card" data-stagger-delay={staggerDelay}>
      {name}
    </article>
  ),
}));

jest.mock("@/components/Animations/RotatingLoader.component", () => ({
  __esModule: true,
  default: () => <div role="status">Laster prosjekter</div>,
}));

describe("Prosjekter page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("preloads and renders projects through the production page", async () => {
    // Arrange
    mockGetProjects.mockResolvedValue([
      createProject(1, "Test Project 1"),
      createProject(2, "Test Project 2"),
      createProject(3, "Test Project 3"),
    ]);

    // Act
    render(<Prosjekter />);
    const projectCards = await screen.findAllByTestId("project-card");

    // Assert
    expect(mockPreloadProjects).toHaveBeenCalledTimes(1);
    expect(mockGetProjects).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("main")).toHaveAttribute(
      "aria-label",
      "Innhold portefølje",
    );
    expect(screen.getByRole("heading", { name: "Prosjekter" })).toBeVisible();
    expect(projectCards).toHaveLength(3);
    expect(projectCards[0]).toHaveTextContent("Test Project 1");
    expect(projectCards[0]).toHaveAttribute("data-stagger-delay", "0");
    expect(projectCards[1]).toHaveAttribute("data-stagger-delay", "0.15");
    expect(projectCards[2]).toHaveAttribute("data-stagger-delay", "0");
  });

  it("renders the production Suspense fallback while projects are pending", () => {
    // Arrange
    mockGetProjects.mockReturnValue(new Promise(() => undefined));

    // Act
    render(<Prosjekter />);

    // Assert
    expect(screen.getByRole("status")).toHaveTextContent("Laster prosjekter");
    expect(screen.getByRole("heading", { name: "Prosjekter" })).toBeVisible();
  });
});
