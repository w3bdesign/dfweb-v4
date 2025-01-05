/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CVContent from "../../src/components/CV/CVContent.component";

const mockCVData = {
  keyQualifications: ["Qualification 1", "Qualification 2"],
  experience: [
    {
      period: "2020-2022",
      company: "Example Company",
      role: "Software Developer",
      description: "Worked on various projects",
    },
  ],
  education: [
    {
      period: "2016-2020",
      institution: "University of Example",
      degree: "Bachelor in Computer Science",
      description: "Studied various aspects of computer science",
    },
  ],
  volunteerWork: [
    {
      period: "2023-2024",
      organization: "AI Community",
      role: "Technical Lead",
      description: "Managing AI Discord community and developing bots",
    },
  ],
};

describe("CVContent", () => {
  it("renders CV header and PDF download button", () => {
    // Arrange
    const expectedElements = {
      header: /cv/i,
      pdfButton: /last ned pdf/i
    };
    
    // Act
    render(<CVContent cvData={mockCVData} />);
    
    // Assert
    expect(screen.getByRole("heading", { name: expectedElements.header })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: expectedElements.pdfButton })).toBeInTheDocument();
  });

  it("renders all navigation tabs", () => {
    // Arrange
    const expectedTabs = [
      /nøkkelkvalifikasjoner/i,
      /erfaring/i,
      /utdanning/i,
      /frivillig arbeid/i
    ];
    
    // Act
    render(<CVContent cvData={mockCVData} />);
    
    // Assert
    expectedTabs.forEach(tabName => {
      expect(screen.getByRole("tab", { name: tabName })).toBeInTheDocument();
    });
  });

  it("displays qualifications in initial tab", () => {
    // Arrange
    const expectedQualification = /qualification 1/i;
    
    // Act
    render(<CVContent cvData={mockCVData} />);
    
    // Assert
    expect(screen.getByText(expectedQualification)).toBeInTheDocument();
  });

  it("displays volunteer work content when switching tabs", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<CVContent cvData={mockCVData} />);
    const volunteerWorkTab = screen.getByRole("tab", { name: /frivillig arbeid/i });
    const expectedContent = {
      role: /technical lead/i,
      organization: /ai community/i
    };
    
    // Act
    await user.click(volunteerWorkTab);
    
    // Assert
    expect(await screen.findByText(expectedContent.role)).toBeInTheDocument();
    expect(await screen.findByText(expectedContent.organization)).toBeInTheDocument();
  });
});
