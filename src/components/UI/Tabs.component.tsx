"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

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
  const [sliderWidth, setSliderWidth] = useState(0);
  const [sliderHeight, setSliderHeight] = useState(0);
  const [sliderTop, setSliderTop] = useState(0);
  const [sliderLeft, setSliderLeft] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeTabElement =
      tabRefs.current[tabs.findIndex((tab) => tab.id === activeTab)];
    if (activeTabElement) {
      setSliderWidth(activeTabElement.offsetWidth);
      setSliderHeight(activeTabElement.offsetHeight);
      setSliderLeft(activeTabElement.offsetLeft);
      setSliderTop(activeTabElement.offsetTop);
    }
  }, [activeTab, tabs]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div
      className={`flex ${vertical ? "flex-col" : "flex-row"} bg-gray-800 rounded-lg overflow-hidden`}
    >
      <div className={`relative ${vertical ? "w-full" : "w-1/4"} bg-gray-700`}>
        <div className={`flex ${vertical ? "flex-row" : "flex-col"}`}>
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[index] = el)}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 ${
                activeTab === tab.id ? "text-white" : ""
              } ${vertical ? "flex-grow text-center" : "w-full text-left"}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <motion.div
          className="absolute bg-indigo-500"
          initial={false}
          animate={{
            width: vertical ? "100%" : sliderWidth,
            height: vertical ? sliderHeight : "100%",
            x: vertical ? 0 : sliderLeft,
            y: vertical ? sliderTop : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
      <div className={`${vertical ? "w-full" : "w-3/4"} bg-gray-800`}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`tabpanel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            className="p-4"
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tab.content}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
