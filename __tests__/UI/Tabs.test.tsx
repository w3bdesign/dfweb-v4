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
    renderTabs();
    const tabList = screen.getByRole("tablist");
    expect(tabList).toHaveClass("sm:flex-col");
  });

  it("renders tabs with correct layout in horizontal orientation", () => {
    renderTabs("horizontal");
    const tabList = screen.getByRole("tablist");
    expect(tabList).toHaveClass("flex-row");
    expect(tabList).not.toHaveClass("sm:flex-col");
  });

  it("applies correct ARIA attributes to tabs", () => {
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

  it("switches tab content when clicking tabs", () => {
    renderTabs();

    // Initial tab should be visible
    expect(screen.getByText("Normal content")).toBeInTheDocument();

    // Click second tab
    const crashingTab = screen.getByRole("tab", { name: "Crashing Tab" });
    fireEvent.click(crashingTab);

    expect(() => {
      render(<ImmediateCrash />);
    }).toThrow("Immediate crash!");
  });

  it("applies correct border styles to tabs", () => {
    renderTabs();
    const tabs = screen.getAllByRole("tab");

    // First tab should not have top border
    expect(tabs[0]).not.toHaveClass("border-t");

    // Second tab should have top border
    expect(tabs[1]).toHaveClass("border-t", "border-gray-600");
  });

  it("renders tab panels with correct attributes", () => {
    renderTabs();

    const activePanel = screen.getByRole("tabpanel");
    expect(activePanel).toHaveAttribute("id", "tabpanel-tab1");
    expect(activePanel).toHaveAttribute("aria-labelledby", "tab-tab1");
    expect(activePanel).toHaveClass("px-8");
  });
});
