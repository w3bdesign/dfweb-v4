/**
 * @jest-environment jsdom
 */

/// <reference types="@testing-library/jest-dom" />

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tabs from "../../src/components/UI/Tabs.component";

// Component that throws an error immediately
const ImmediateCrash = () => {
  throw new Error("Immediate crash!");
};

const mockMotion = {
  motion: {
    div: (props: React.ComponentProps<"div">) => (
      <div {...props}>{props.children}</div>
    ),
    button: (props: React.ComponentProps<"button">) => (
      <button type="button" {...props}>
        {props.children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
};

jest.mock("motion", () => mockMotion);

const mockTabs = [
  {
    id: "tab1",
    label: "Normal Tab",
    content: <div>Normal content</div>,
  },
  {
    id: "tab2",
    label: "Crashing Tab",
    content: <ImmediateCrash />,
  },
];

describe("Tabs", () => {
  const renderTabs = (orientation?: "horizontal" | "vertical") =>
    render(<Tabs tabs={mockTabs} orientation={orientation} />);

  it("renders tabs with correct layout in vertical orientation", () => {
    // Arrange
    const orientation = undefined; // default vertical orientation
    
    // Act
    renderTabs(orientation);
    const tabList = screen.getByRole("tablist");
    
    // Assert
    expect(tabList).toHaveClass("sm:flex-col");
  });

  it("renders tabs with correct layout in horizontal orientation", () => {
    // Arrange
    const orientation = "horizontal";
    
    // Act
    renderTabs(orientation);
    const tabList = screen.getByRole("tablist");
    
    // Assert
    expect(tabList).toHaveClass("flex-row");
    expect(tabList).not.toHaveClass("sm:flex-col");
  });

  it("applies correct ARIA attributes to tabs", () => {
    // Arrange
    const expectedAttributes = mockTabs.map((tab, index) => ({
      tab,
      isSelected: index === 0,
      controlsId: `tabpanel-${tab.id}`
    }));
    
    // Act
    renderTabs();
    
    // Assert
    expectedAttributes.forEach(({ tab, isSelected, controlsId }) => {
      const tabElement = screen.getByRole("tab", { name: tab.label });
      expect(tabElement).toHaveAttribute("aria-selected", isSelected.toString());
      expect(tabElement).toHaveAttribute("aria-controls", controlsId);
    });
  });

  it("switches tab content when clicking tabs", () => {
    // Arrange
    renderTabs();
    const initialContent = "Normal content";
    
    // Act & Assert - Initial state
    expect(screen.getByText(initialContent)).toBeInTheDocument();
    
    // Act & Assert - Click handling
    const crashingTab = screen.getByRole("tab", { name: "Crashing Tab" });
    expect(() => {
      fireEvent.click(crashingTab);
      render(<ImmediateCrash />);
    }).toThrow("Immediate crash!");
  });

  it("applies correct border styles to tabs", () => {
    // Arrange
    renderTabs();
    
    // Act
    const tabs = screen.getAllByRole("tab");
    
    // Assert
    expect(tabs[0]).not.toHaveClass("border-t");
    expect(tabs[1]).toHaveClass("border-t", "border-gray-600");
  });

  it("renders tab panels with correct attributes", () => {
    // Arrange
    const expectedAttributes = {
      id: "tabpanel-tab1",
      labelledBy: "tab-tab1",
      className: "px-8"
    };
    
    // Act
    renderTabs();
    const activePanel = screen.getByRole("tabpanel");
    
    // Assert
    expect(activePanel).toHaveAttribute("id", expectedAttributes.id);
    expect(activePanel).toHaveAttribute("aria-labelledby", expectedAttributes.labelledBy);
    expect(activePanel).toHaveClass(expectedAttributes.className);
  });
});
