/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Tabs from "../../src/components/UI/Tabs.component";

// Mock framer-motion to avoid issues with animations in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: "div",
    button: "button",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

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
};

const mockTabs = [
  {
    id: "qualifications",
    label: "Nøkkelkvalifikasjoner",
    content: (
      <ul className="list-disc pl-5 text-gray-300">
        {mockCVData.keyQualifications.map((qual) => (
          <li key={qual} className="mb-2">
            {qual}
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "experience",
    label: "Erfaring",
    content: (
      <div className="text-gray-300">
        {mockCVData.experience.map((exp) => (
          <div key={exp.description} className="mb-6">
            <h3 className="font-semibold text-white">
              {exp.period} - {exp.company}
            </h3>
            {exp.role && <p className="italic">{exp.role}</p>}
            <p>{exp.description}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "education",
    label: "Utdanning",
    content: (
      <div className="text-gray-300">
        {mockCVData.education.map((edu) => (
          <div key={edu.description} className="mb-6">
            <h3 className="font-semibold text-white">
              {edu.period} - {edu.institution}
            </h3>
            {edu.degree && <p className="italic">{edu.degree}</p>}
            <p>{edu.description}</p>
          </div>
        ))}
      </div>
    ),
  },
];

describe("Tabs", () => {
  it("renders all CV tab labels", () => {
    render(<Tabs tabs={mockTabs} />);
    expect(
      screen.getByRole("tab", { name: "Nøkkelkvalifikasjoner" })
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Erfaring" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Utdanning" })).toBeInTheDocument();
  });

  it("renders the first tab content (Nøkkelkvalifikasjoner) by default", () => {
    render(<Tabs tabs={mockTabs} />);
    expect(screen.getByText("Qualification 1")).toBeInTheDocument();
    expect(screen.getByText("Qualification 2")).toBeInTheDocument();
    expect(screen.queryByText("Example Company")).not.toBeInTheDocument();
    expect(screen.queryByText("University of Example")).not.toBeInTheDocument();
  });

  it("switches to Erfaring tab when clicked", () => {
    render(<Tabs tabs={mockTabs} />);
    fireEvent.click(screen.getByRole("tab", { name: "Erfaring" }));
    expect(screen.getByText("2020-2022 - Example Company")).toBeInTheDocument();
    expect(screen.getByText("Software Developer")).toBeInTheDocument();
    expect(screen.getByText("Worked on various projects")).toBeInTheDocument();
    expect(screen.queryByText("Qualification 1")).not.toBeInTheDocument();
  });

  it("switches to Utdanning tab when clicked", () => {
    render(<Tabs tabs={mockTabs} />);
    fireEvent.click(screen.getByRole("tab", { name: "Utdanning" }));
    expect(
      screen.getByText("2016-2020 - University of Example")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Bachelor in Computer Science")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Studied various aspects of computer science")
    ).toBeInTheDocument();
    expect(screen.queryByText("Qualification 1")).not.toBeInTheDocument();
  });

  it("applies correct ARIA attributes to CV tabs", () => {
    render(<Tabs tabs={mockTabs} />);
    const qualificationsTab = screen.getByRole("tab", {
      name: "Nøkkelkvalifikasjoner",
    });
    expect(qualificationsTab).toHaveAttribute("aria-selected", "true");
    expect(qualificationsTab).toHaveAttribute(
      "aria-controls",
      "tabpanel-qualifications"
    );

    const experienceTab = screen.getByRole("tab", { name: "Erfaring" });
    expect(experienceTab).toHaveAttribute("aria-selected", "false");
    expect(experienceTab).toHaveAttribute(
      "aria-controls",
      "tabpanel-experience"
    );
  });

  it("renders in vertical orientation by default", () => {
    render(<Tabs tabs={mockTabs} />);
    const tabList = screen.getByRole("tablist");
    expect(tabList).toHaveClass("sm:flex-col");
  });
});
