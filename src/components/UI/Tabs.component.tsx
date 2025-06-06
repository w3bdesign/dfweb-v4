"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
}

const getTabButtonClassName = (
  isActive: boolean,
  isVertical: boolean,
  index: number,
  totalTabs: number,
) => {
  const baseClasses = "px-4 py-3 text-sm font-medium relative";
  const activeClasses = isActive
    ? "text-white"
    : "text-gray-300 hover:text-white";
  const orientationClasses = isVertical
    ? "w-full text-left"
    : "grow text-center";
  const borderClasses = [
    index !== 0 ? "border-t border-gray-600" : "",
    isVertical && index !== totalTabs - 1 ? "border-b border-gray-600" : "",
  ].join(" ");

  return `${baseClasses} ${activeClasses} ${orientationClasses} ${borderClasses}`;
};

const TabButton: React.FC<TabButtonProps> = ({
  tab,
  isActive,
  isVertical,
  index,
  totalTabs,
  onClick,
}) => (
  <motion.button
    key={tab.id}
    onClick={onClick}
    className={getTabButtonClassName(isActive, isVertical, index, totalTabs)}
    role="tab"
    aria-selected={isActive}
    aria-controls={`tabpanel-${tab.id}`}
    id={`tab-${tab.id}`}
  >
    {isActive && (
      <motion.div
        layoutId="active-tab"
        className={`absolute ${
          isVertical ? "inset-y-0 left-0 w-1" : "inset-x-0 bottom-0 h-1"
        } bg-[var(--matrix-dark)]`}
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
    <span className="relative z-10">{tab.label}</span>
  </motion.button>
);

const TabPanel: React.FC<{ tab: Tab; isActive: boolean }> = ({
  tab,
  isActive,
}) => {
  if (!isActive) return null;

  return (
    <motion.div
      key={tab.id}
      role="tabpanel"
      id={`tabpanel-${tab.id}`}
      aria-labelledby={`tab-${tab.id}`}
      className="px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {tab.content}
    </motion.div>
  );
};

/**
 * Renders a set of tabs with content.
 *
 * @param {TabsProps} props - The props object containing the tabs and orientation.
 * @param {Tab[]} props.tabs - An array of Tab objects representing the tabs.
 * @param {string} [props.orientation="vertical"] - The orientation of the tabs. Defaults to "vertical".
 * @return {JSX.Element} The rendered Tabs component.
 */
const Tabs: React.FC<TabsProps> = ({ tabs, orientation = "vertical" }) => {
  const [activeTab, setActiveTab] = useState(() => tabs[0]?.id ?? "");
  const isVertical = orientation === "vertical";

  return (
    <div className="bg-gray-800 p-6 rounded-lg md:min-w-[900px] md:max-w-[1000px] min-h-[20rem]">
      <div
        className={`flex ${
          isVertical ? "flex-col sm:flex-row" : "flex-col"
        } bg-gray-800 rounded-lg h-[calc(75vh-2rem)] mt-4`}
      >
        <div
          className={`${isVertical ? "sm:w-1/4 w-full" : "w-full"} bg-gray-700 ${
            isVertical ? "max-h-[185px] " : ""
          }`}
        >
          <div
            className={`flex ${isVertical ? "flex-row sm:flex-col" : "flex-row"}`}
            role="tablist"
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
              />
            ))}
          </div>
        </div>
        <div
          className={`${
            isVertical ? "sm:w-3/4 w-full" : "w-full"
          } bg-gray-800 overflow-y-auto`}
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
  );
};

export default Tabs;
