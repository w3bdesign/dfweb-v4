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
    expectedTexts: mockCVData.keyQualifications,
    unexpectedTexts: ["Example Company", "University of Example"],
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
    expectedTexts: [
      "2020-2022 - Example Company",
      "Software Developer",
      "Worked on various projects",
    ],
    unexpectedTexts: ["Qualification 1"],
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
    expectedTexts: [
      "2016-2020 - University of Example",
      "Bachelor in Computer Science",
      "Studied various aspects of computer science",
    ],
    unexpectedTexts: ["Qualification 1"],
  },
];

describe("Tabs", () => {
  const renderTabs = () => render(<Tabs tabs={mockTabs} />);

  const expectTextsToBePresent = (texts: string[]) => {
    texts.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  };

  const expectTextsNotToBePresent = (texts: string[]) => {
    texts.forEach((text) => {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    });
  };

  it("renders all CV tab labels", () => {
    renderTabs();
    mockTabs.forEach((tab) => {
      expect(screen.getByRole("tab", { name: tab.label })).toBeInTheDocument();
    });
  });

  it.each(mockTabs)("renders correct content for $label tab", (tab) => {
    renderTabs();
    if (tab.id !== mockTabs[0].id) {
      fireEvent.click(screen.getByRole("tab", { name: tab.label }));
    }
    expectTextsToBePresent(tab.expectedTexts);
    expectTextsNotToBePresent(tab.unexpectedTexts);
  });

  it("applies correct ARIA attributes to CV tabs", () => {
    renderTabs();
    mockTabs.forEach((tab, index) => {
      const tabElement = screen.getByRole("tab", { name: tab.label });
      expect(tabElement).toHaveAttribute(
        "aria-selected",
        index === 0 ? "true" : "false"
      );
      expect(tabElement).toHaveAttribute("aria-controls", `tabpanel-${tab.id}`);
    });
  });

  it("renders in vertical orientation by default", () => {
    renderTabs();
    const tabList = screen.getByRole("tablist");
    expect(tabList).toHaveClass("sm:flex-col");
  });
});
