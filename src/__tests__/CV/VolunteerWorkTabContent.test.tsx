import React from "react";
import { render, screen } from "@testing-library/react";
import VolunteerWorkTabContent from "@/components/CV/VolunteerWorkTabContent";

describe("VolunteerWorkTabContent", () => {
  it("renders volunteer work items with all fields", () => {
    // Arrange
    const mockVolunteerWork = [
      {
        period: "2020-2022",
        organization: "Open Source Foundation",
        role: "Maintainer",
        description: "Maintained open source projects",
      },
    ];

    // Act
    render(<VolunteerWorkTabContent volunteerWork={mockVolunteerWork} />);

    // Assert
    expect(
      screen.getByText("2020-2022 - Open Source Foundation"),
    ).toBeInTheDocument();
    expect(screen.getByText("Maintainer")).toBeInTheDocument();
    expect(
      screen.getByText("Maintained open source projects"),
    ).toBeInTheDocument();
  });

  it("renders with missing period and organization (nullish coalescing branches)", () => {
    // Arrange
    const mockVolunteerWork = [
      {
        role: "Volunteer",
        description: "Helped with events",
      },
    ];

    // Act
    render(<VolunteerWorkTabContent volunteerWork={mockVolunteerWork} />);

    // Assert
    expect(screen.getByText(" - ")).toBeInTheDocument();
    expect(screen.getByText("Volunteer")).toBeInTheDocument();
  });

  it("renders without role (conditional branch)", () => {
    // Arrange
    const mockVolunteerWork = [
      {
        period: "2021-2023",
        organization: "Community Group",
        description: "Community outreach",
      },
    ];

    // Act
    render(<VolunteerWorkTabContent volunteerWork={mockVolunteerWork} />);

    // Assert
    expect(
      screen.getByText("2021-2023 - Community Group"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Maintainer")).not.toBeInTheDocument();
  });

  it("renders with undefined volunteerWork", () => {
    // Act
    render(<VolunteerWorkTabContent />);

    // Assert
    expect(
      screen.queryByText("Open Source Foundation"),
    ).not.toBeInTheDocument();
  });

  it("renders with empty volunteerWork array", () => {
    // Act
    render(<VolunteerWorkTabContent volunteerWork={[]} />);

    // Assert
    expect(
      screen.queryByText("Open Source Foundation"),
    ).not.toBeInTheDocument();
  });
});
