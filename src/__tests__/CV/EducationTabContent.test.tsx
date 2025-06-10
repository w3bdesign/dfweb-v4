import React from "react";
import { render, screen } from "@testing-library/react";
import EducationTabContent from "@/components/CV/EducationTabContent";

describe("EducationTabContent", () => {
  it("renders education items with degree (conditional branch)", () => {
    // Arrange
    const mockEducation = [
      {
        period: "2020-2024",
        institution: "University of Technology",
        degree: "Bachelor of Computer Science",
        description: "Studied computer science fundamentals",
      },
    ];

    // Act
    render(<EducationTabContent education={mockEducation} />);

    // Assert
    expect(
      screen.getByText("2020-2024 - University of Technology"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Bachelor of Computer Science"),
    ).toBeInTheDocument();
  });

  it("renders education items without degree (conditional branch)", () => {
    // Arrange
    const mockEducation = [
      {
        period: "2020-2024",
        institution: "University of Technology",
        description: "Studied computer science fundamentals",
        // No degree property to test the conditional
      },
    ];

    // Act
    render(<EducationTabContent education={mockEducation} />);

    // Assert
    expect(
      screen.getByText("2020-2024 - University of Technology"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Bachelor of Computer Science"),
    ).not.toBeInTheDocument();
  });

  it("renders education items with empty degree (conditional branch)", () => {
    // Arrange
    const mockEducation = [
      {
        period: "2020-2024",
        institution: "University of Technology",
        degree: "", // Empty string to test the conditional
        description: "Studied computer science fundamentals",
      },
    ];

    // Act
    render(<EducationTabContent education={mockEducation} />);

    // Assert
    expect(
      screen.getByText("2020-2024 - University of Technology"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Bachelor of Computer Science"),
    ).not.toBeInTheDocument();
  });

  it("renders with undefined education", () => {
    // Act
    render(<EducationTabContent />);

    // Assert - Should not crash and render empty content
    expect(
      screen.queryByText("University of Technology"),
    ).not.toBeInTheDocument();
  });

  it("renders with empty education array", () => {
    // Act
    render(<EducationTabContent education={[]} />);

    // Assert - Should not crash and render empty content
    expect(
      screen.queryByText("University of Technology"),
    ).not.toBeInTheDocument();
  });
});
