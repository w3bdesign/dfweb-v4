/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Tabs from "@/components/UI/Tabs.component";

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

const keyboardTestTabs = [
  {
    id: "tab1",
    label: "First Tab",
    content: <div>First content</div>,
  },
  {
    id: "tab2",
    label: "Second Tab",
    content: <div>Second content</div>,
  },
  {
    id: "tab3",
    label: "Third Tab",
    content: <div>Third content</div>,
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
      controlsId: `tabpanel-${tab.id}`,
    }));

    // Act
    renderTabs();

    // Assert
    expectedAttributes.forEach(({ tab, isSelected, controlsId }) => {
      const tabElement = screen.getByRole("tab", { name: tab.label });
      expect(tabElement).toHaveAttribute(
        "aria-selected",
        isSelected.toString(),
      );
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
      className: "px-8",
    };

    // Act
    renderTabs();
    const activePanel = screen.getByRole("tabpanel");

    // Assert
    expect(activePanel).toHaveAttribute("id", expectedAttributes.id);
    expect(activePanel).toHaveAttribute(
      "aria-labelledby",
      expectedAttributes.labelledBy,
    );
    expect(activePanel).toHaveClass(expectedAttributes.className);
  });
});

describe("Tabs Keyboard Navigation (WAI-ARIA APG)", () => {
  const renderKeyboardTabs = (orientation?: "horizontal" | "vertical") =>
    render(<Tabs tabs={keyboardTestTabs} orientation={orientation} />);

  /** Helper: press keys from a starting tab and assert focus lands on expected index */
  async function pressKeysAndExpectFocus(
    orientation: "horizontal" | "vertical",
    startIndex: number,
    keys: string[],
    expectedFocusIndex: number,
  ) {
    // Arrange
    const user = userEvent.setup();
    renderKeyboardTabs(orientation);
    const tabs = screen.getAllByRole("tab");

    // Act
    if (startIndex > 0) fireEvent.click(tabs[startIndex]);
    tabs[startIndex].focus();
    for (const key of keys) {
      await user.keyboard(key);
    }

    // Assert
    expect(document.activeElement).toBe(tabs[expectedFocusIndex]);
    expect(tabs[expectedFocusIndex]).toHaveAttribute("aria-selected", "true");
  }

  it("sets tabIndex=0 on active tab and tabIndex=-1 on inactive tabs", () => {
    // Arrange
    renderKeyboardTabs();

    // Act
    const tabs = screen.getAllByRole("tab");

    // Assert
    expect(tabs[0]).toHaveAttribute("tabIndex", "0");
    expect(tabs[1]).toHaveAttribute("tabIndex", "-1");
    expect(tabs[2]).toHaveAttribute("tabIndex", "-1");
  });

  it("ArrowDown moves to next tab in vertical orientation", async () => {
    // Arrange, Act & Assert
    await pressKeysAndExpectFocus("vertical", 0, ["{ArrowDown}"], 1);
  });

  it("ArrowUp moves to previous tab in vertical orientation", async () => {
    // Arrange, Act & Assert
    await pressKeysAndExpectFocus("vertical", 0, ["{ArrowDown}", "{ArrowUp}"], 0);
  });

  it("ArrowRight moves to next tab in horizontal orientation", async () => {
    // Arrange, Act & Assert
    await pressKeysAndExpectFocus("horizontal", 0, ["{ArrowRight}"], 1);
  });

  it("ArrowLeft moves to previous tab in horizontal orientation", async () => {
    // Arrange, Act & Assert
    await pressKeysAndExpectFocus("horizontal", 0, ["{ArrowRight}", "{ArrowLeft}"], 0);
  });

  it("wraps focus from last tab to first tab on ArrowDown", async () => {
    // Arrange, Act & Assert
    await pressKeysAndExpectFocus("vertical", 2, ["{ArrowDown}"], 0);
  });

  it("wraps focus from first tab to last tab on ArrowUp", async () => {
    // Arrange, Act & Assert
    await pressKeysAndExpectFocus("vertical", 0, ["{ArrowUp}"], 2);
  });

  it("Home key moves focus to first tab from any position", async () => {
    // Arrange, Act & Assert
    await pressKeysAndExpectFocus("vertical", 0, ["{ArrowDown}", "{ArrowDown}", "{Home}"], 0);
  });

  it("End key moves focus to last tab", async () => {
    // Arrange, Act & Assert
    await pressKeysAndExpectFocus("vertical", 0, ["{End}"], 2);
  });

  it("sets aria-orientation=vertical on tablist for vertical tabs", () => {
    // Arrange & Act
    renderKeyboardTabs("vertical");

    // Assert
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("sets aria-orientation=horizontal on tablist for horizontal tabs", () => {
    // Arrange & Act
    renderKeyboardTabs("horizontal");

    // Assert
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("tab panel is focusable with tabIndex=0", () => {
    // Arrange
    renderKeyboardTabs();

    // Act
    const tabpanel = screen.getByRole("tabpanel");

    // Assert
    expect(tabpanel).toHaveAttribute("tabIndex", "0");
  });
});
