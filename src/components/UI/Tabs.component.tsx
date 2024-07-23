"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  orientation?: "horizontal" | "vertical";
}

/**
 * Renders a set of tabs with animations and transitions.
 *
 * @param {TabsProps} props - The props object containing the tabs and orientation.
 * @param {Tab[]} props.tabs - An array of Tab objects representing the tabs.
 * @param {string} [props.orientation="vertical"] - The orientation of the tabs ("vertical" or "horizontal").
 * @return {JSX.Element} The rendered Tabs component.
 */
const Tabs: React.FC<TabsProps> = ({ tabs, orientation = "vertical" }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const isVertical = orientation === "vertical";

  return (
    <div className="bg-gray-800 p-6 rounded-b-lg">
      <div
        className={`flex ${isVertical ? "flex-col sm:flex-row" : "flex-col"} bg-gray-800 rounded-lg overflow-hidden`}
      >
        <div
          className={`${isVertical ? "sm:w-1/4 w-full" : "w-full"} bg-gray-700`}
        >
          <div
            className={`flex ${isVertical ? "flex-row sm:flex-col" : "flex-row"}`}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-3 text-sm font-medium relative ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                } ${isVertical ? "w-full text-left" : "flex-grow text-center"}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab"
                    className={`absolute ${isVertical ? "inset-y-0 left-0 w-1" : "inset-x-0 bottom-0 h-1"} bg-indigo-500`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        <div
          className={`${isVertical ? "sm:w-3/4 w-full" : "w-full"} bg-gray-800`}
        >
          <AnimatePresence mode="wait">
            {tabs.map(
              (tab) =>
                activeTab === tab.id && (
                  <motion.div
                    key={tab.id}
                    role="tabpanel"
                    id={`tabpanel-${tab.id}`}
                    aria-labelledby={`tab-${tab.id}`}
                    className="p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {tab.content}
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
