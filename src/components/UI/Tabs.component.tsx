"use client";

import React, { useState, useRef, useCallback } from "react";
import { AnimatePresence, LazyMotion, domMax } from "motion/react";
import * as m from "motion/react-m";

type TabOrientation = "horizontal" | "vertical";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  orientation?: TabOrientation;
}

interface TabButtonProps {
  tab: Tab;
  isActive: boolean;
  isVertical: boolean;
  index: number;
  totalTabs: number;
  onClick: () => void;
  tabIndex: number;
  buttonRef: (el: HTMLButtonElement | null) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
}

const getTabButtonClassName = (
  isActive: boolean,
  isVertical: boolean,
  index: number,
  totalTabs: number,
) => {
  const baseClasses =
    "px-4 py-3 text-sm font-medium relative cursor-pointer transition-colors duration-200";
  const activeClasses = isActive
    ? "text-white"
    : "text-gray-300 hover:text-white hover:bg-gray-600";
  const orientationClasses = isVertical
    ? "w-full text-left"
    : "grow text-center";
  const borderClasses = index !== 0 ? "border-t border-gray-600" : "";

  return `${baseClasses} ${activeClasses} ${orientationClasses} ${borderClasses}`;
};

const TabButton: React.FC<TabButtonProps> = ({
  tab,
  isActive,
  isVertical,
  index,
  totalTabs,
  onClick,
  tabIndex,
  buttonRef,
  onKeyDown,
}) => (
  <m.button
    key={tab.id}
    ref={buttonRef}
    onClick={onClick}
    onKeyDown={onKeyDown}
    className={getTabButtonClassName(isActive, isVertical, index, totalTabs)}
    role="tab"
    aria-selected={isActive}
    aria-controls={`tabpanel-${tab.id}`}
    id={`tab-${tab.id}`}
    tabIndex={tabIndex}
  >
    {isActive && (
      <m.div
        layoutId="active-tab"
        className={`absolute ${
          isVertical ? "inset-y-0 left-0 w-1" : "inset-x-0 bottom-0 h-1"
        } bg-[var(--matrix-dark)]`}
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
    <span className="relative z-10">{tab.label}</span>
  </m.button>
);

const TabPanel: React.FC<{ tab: Tab; isActive: boolean }> = ({
  tab,
  isActive,
}) => {
  if (!isActive) return null;

  return (
    <m.div
      key={tab.id}
      role="tabpanel"
      id={`tabpanel-${tab.id}`}
      aria-labelledby={`tab-${tab.id}`}
      className="px-8"
      tabIndex={0}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {tab.content}
    </m.div>
  );
};

/**
 * Renders a set of tabs with content.
 * Implements WAI-ARIA APG Tabs Pattern keyboard navigation:
 * - Arrow Left/Up: Move to previous tab
 * - Arrow Right/Down: Move to next tab
 * - Home: Move to first tab
 * - End: Move to last tab
 *
 * @param {TabsProps} props - The props object containing the tabs and orientation.
 * @param {Tab[]} props.tabs - An array of Tab objects representing the tabs.
 * @param {string} [props.orientation="vertical"] - The orientation of the tabs. Defaults to "vertical".
 * @return {JSX.Element} The rendered Tabs component.
 */
const Tabs: React.FC<TabsProps> = ({ tabs, orientation = "vertical" }) => {
  const [activeTab, setActiveTab] = useState(() => tabs[0]?.id ?? "");
  const isVertical = orientation === "vertical";
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const setTabRef = useCallback(
    (index: number) => (el: HTMLButtonElement | null) => {
      tabRefs.current[index] = el;
    },
    [],
  );

  const focusTab = useCallback(
    (index: number) => {
      const tab = tabs[index];
      if (tab) {
        setActiveTab(tab.id);
        tabRefs.current[index]?.focus();
      }
    },
    [tabs],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
      const nextKey = isVertical ? "ArrowDown" : "ArrowRight";

      let newIndex: number | null = null;

      switch (e.key) {
        case nextKey:
          e.preventDefault();
          newIndex = (index + 1) % tabs.length;
          break;
        case prevKey:
          e.preventDefault();
          newIndex = (index - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = tabs.length - 1;
          break;
      }

      if (newIndex !== null) {
        focusTab(newIndex);
      }
    },
    [tabs.length, isVertical, focusTab],
  );

  return (
    <LazyMotion features={domMax}>
      <div className="bg-gray-800 p-6 rounded-lg md:min-w-[900px] md:max-w-[1000px]">
        <div
          className={`flex ${
            isVertical ? "flex-col sm:flex-row" : "flex-col"
          } bg-gray-800 rounded-lg h-[28rem] mt-4`}
        >
          <div
            className={`${isVertical ? "sm:w-1/4 w-full" : "w-full"} bg-gray-700 ${
              isVertical ? "sm:h-fit" : ""
            }`}
          >
            <div
              className={`flex ${isVertical ? "flex-row sm:flex-col" : "flex-row"}`}
              role="tablist"
              aria-orientation={isVertical ? "vertical" : "horizontal"}
            >
              {tabs.map((tab, index) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  isVertical={isVertical}
                  index={index}
                  totalTabs={tabs.length}
                  onClick={() => setActiveTab(tab.id)}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  buttonRef={setTabRef(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
          </div>
          <div
            className={`${
              isVertical ? "sm:w-3/4 w-full" : "w-full"
            } bg-gray-800 overflow-y-auto [scrollbar-gutter:stable]`}
          >
            <AnimatePresence mode="wait">
              {tabs.map((tab) => (
                <TabPanel
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
};

export default Tabs;
