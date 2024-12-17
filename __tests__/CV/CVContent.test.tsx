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
  it("CVContent renders correctly with mock data", async () => {
    render(<CVContent cvData={mockCVData} />);

    // Check if the CV header is present
    const cvHeader = screen.getByRole("heading", { name: /cv/i });
    expect(cvHeader).toBeInTheDocument();

    // Check if the "Last ned PDF" button is present
    const pdfButton = screen.getByRole("link", { name: /last ned pdf/i });
    expect(pdfButton).toBeInTheDocument();

    // Check if tabs are present
    const qualificationsTab = screen.getByRole("tab", {
      name: /nøkkelkvalifikasjoner/i,
    });
    const experienceTab = screen.getByRole("tab", { name: /erfaring/i });
    const educationTab = screen.getByRole("tab", { name: /utdanning/i });
    const volunteerWorkTab = screen.getByRole("tab", { name: /frivillig arbeid/i });
    expect(qualificationsTab).toBeInTheDocument();
    expect(experienceTab).toBeInTheDocument();
    expect(educationTab).toBeInTheDocument();
    expect(volunteerWorkTab).toBeInTheDocument();

    // Check if mock data is rendered (you might need to click on tabs to see this content)
    const qualification = screen.getByText(/qualification 1/i);
    expect(qualification).toBeInTheDocument();

    // Set up user event
    const user = userEvent.setup();

    // Click on volunteer work tab and check its content
    await user.click(volunteerWorkTab);

    // Check volunteer work content
    const volunteerRole = await screen.findByText(/technical lead/i);
    expect(volunteerRole).toBeInTheDocument();
    const volunteerOrg = await screen.findByText(/ai community/i);
    expect(volunteerOrg).toBeInTheDocument();
  });
});
