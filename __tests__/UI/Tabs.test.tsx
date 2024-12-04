/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tabs from "../../src/components/UI/Tabs.component";

jest.mock("motion", () => ({
  __esModule: true,
  motion: {
    div: ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, ...props }: React.HTMLProps<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
    ),
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

interface MockTab {
  id: string;
  label: string;
  content: React.ReactNode;
  expectedTexts: string[];
  unexpectedTexts: string[];
}

const mockTabs: MockTab[] = [
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
      `${mockCVData.experience[0].period} - ${mockCVData.experience[0].company}`,
      mockCVData.experience[0].role,
      mockCVData.experience[0].description,
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
      `${mockCVData.education[0].period} - ${mockCVData.education[0].institution}`,
      mockCVData.education[0].degree,
      mockCVData.education[0].description,
    ],
    unexpectedTexts: ["Qualification 1"],
  },
];

describe("Tabs", () => {
  const renderTabs = (orientation?: "horizontal" | "vertical") =>
    render(<Tabs tabs={mockTabs} orientation={orientation} />);

  const expectTextsToBePresent = async (texts: string[]) => {
    await Promise.all(
      texts.map(async (text) => {
        await waitFor(() => {
          expect(screen.getByText(text)).toBeInTheDocument();
        });
      }),
    );
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

  test.each(mockTabs)("renders correct content for $label tab", async (tab: MockTab) => {
    renderTabs();
    if (tab.id !== mockTabs[0].id) {
      fireEvent.click(screen.getByRole("tab", { name: tab.label }));
    }
    await expectTextsToBePresent(tab.expectedTexts);
    expectTextsNotToBePresent(tab.unexpectedTexts);
  });

  it("applies correct ARIA attributes to CV tabs", () => {
    renderTabs();
    mockTabs.forEach((tab, index) => {
      const tabElement = screen.getByRole("tab", { name: tab.label });
      expect(tabElement).toHaveAttribute(
        "aria-selected",
        index === 0 ? "true" : "false",
      );
      expect(tabElement).toHaveAttribute("aria-controls", `tabpanel-${tab.id}`);
    });
  });

  it("renders in vertical orientation by default", () => {
    renderTabs();
    const tabList = screen.getByRole("tablist");
    expect(tabList).toHaveClass("sm:flex-col");
  });

  it("renders in horizontal orientation when specified", () => {
    renderTabs("horizontal");
    const tabList = screen.getByRole("tablist");
    expect(tabList).toHaveClass("flex-row");
    expect(tabList).not.toHaveClass("sm:flex-col");
  });

  it("applies correct border styles to tabs", () => {
    renderTabs();
    const tabs = screen.getAllByRole("tab");
    
    // First tab should not have top border
    expect(tabs[0]).not.toHaveClass("border-t");
    
    // Second tab should have top border
    expect(tabs[1]).toHaveClass("border-t", "border-gray-600");
  });

  it("renders tab panels with correct attributes and transitions", async () => {
    renderTabs();
    
    // Check initial tab panel
    let activePanel = screen.getByRole("tabpanel");
    expect(activePanel).toHaveAttribute("id", "tabpanel-qualifications");
    expect(activePanel).toHaveAttribute("aria-labelledby", "tab-qualifications");
    expect(activePanel).toHaveClass("px-8");
    
    // Switch to another tab and verify panel
    fireEvent.click(screen.getByRole("tab", { name: "Erfaring" }));
    await waitFor(() => {
      activePanel = screen.getByRole("tabpanel");
      expect(activePanel).toHaveAttribute("id", "tabpanel-experience");
      expect(activePanel).toHaveAttribute("aria-labelledby", "tab-experience");
      expect(activePanel).toHaveClass("px-8");
    });
    
    // Switch to last tab and verify panel
    fireEvent.click(screen.getByRole("tab", { name: "Utdanning" }));
    await waitFor(() => {
      activePanel = screen.getByRole("tabpanel");
      expect(activePanel).toHaveAttribute("id", "tabpanel-education");
      expect(activePanel).toHaveAttribute("aria-labelledby", "tab-education");
      expect(activePanel).toHaveClass("px-8");
    });
  });
});
