import React from "react";
import { render, screen } from "@testing-library/react";
import ExperienceTabContent from "@/components/CV/ExperienceTabContent";

describe("ExperienceTabContent", () => {
  it("renders experience items with role (conditional branch)", () => {
    // Arrange
    const mockExperience = [
      {
        period: "2022-2024",
        company: "Tech Company Inc",
        role: "Senior Developer",
        description: "Developed web applications",
      },
    ];

    // Act
    render(<ExperienceTabContent experience={mockExperience} />);

    // Assert
    expect(
      screen.getByText("2022-2024 - Tech Company Inc"),
    ).toBeInTheDocument();
    expect(screen.getByText("Senior Developer")).toBeInTheDocument();
  });

  it("renders experience items without role (conditional branch)", () => {
    // Arrange
    const mockExperience = [
      {
        period: "2022-2024",
        company: "Tech Company Inc",
        description: "Developed web applications",
        // No role property to test the conditional
      },
    ];

    // Act
    render(<ExperienceTabContent experience={mockExperience} />);

    // Assert
    expect(
      screen.getByText("2022-2024 - Tech Company Inc"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Senior Developer")).not.toBeInTheDocument();
  });

  it("renders experience items with empty role (conditional branch)", () => {
    // Arrange
    const mockExperience = [
      {
        period: "2022-2024",
        company: "Tech Company Inc",
        role: "", // Empty string to test the conditional
        description: "Developed web applications",
      },
    ];

    // Act
    render(<ExperienceTabContent experience={mockExperience} />);

    // Assert
    expect(
      screen.getByText("2022-2024 - Tech Company Inc"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Senior Developer")).not.toBeInTheDocument();
  });

  it("renders with undefined experience", () => {
    // Act
    render(<ExperienceTabContent />);

    // Assert - Should not crash and render empty content
    expect(screen.queryByText("Tech Company Inc")).not.toBeInTheDocument();
  });

  it("renders with empty experience array", () => {
    // Act
    render(<ExperienceTabContent experience={[]} />);

    // Assert - Should not crash and render empty content
    expect(screen.queryByText("Tech Company Inc")).not.toBeInTheDocument();
  });
});
