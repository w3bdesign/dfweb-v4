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
  vertical?: boolean;
}

const Tabs: React.FC<TabsProps> = ({ tabs, vertical = false }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div
      className={`flex ${vertical ? "flex-col" : "flex-row"} bg-gray-800 rounded-lg overflow-hidden`}
    >
      <div className={`relative ${vertical ? "w-full" : "w-1/4"} bg-gray-700`}>
        <div className={`flex ${vertical ? "flex-col" : "flex-row"}`}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-2 text-sm font-medium relative ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              } ${vertical ? "w-full text-center" : "flex-grow text-center"}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-indigo-500"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
      <div className={`${vertical ? "w-full" : "w-3/4"} bg-gray-800`}>
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
  );
};

export default Tabs;
