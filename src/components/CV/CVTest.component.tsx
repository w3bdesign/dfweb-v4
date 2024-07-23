"use client";

import React, { useState } from "react";

const TabButton = ({ label, isActive, onClick }) => (
  <button
    className={`px-4 py-2 font-semibold ${
      isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const CVSection = ({ title, content }) => (
  <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p>{content}</p>
  </div>
);

const CVInnhold = () => {
  const [activeTab, setActiveTab] = useState("experience");

  const cvData = {
    experience: [
      { title: "Senior Developer", content: "Company XYZ (2020-Present)" },
      { title: "Full Stack Developer", content: "Tech Co. (2017-2020)" },
    ],
    education: [
      {
        title: "MSc in Computer Science",
        content: "University ABC (2015-2017)",
      },
      {
        title: "BSc in Software Engineering",
        content: "Tech Institute (2011-2015)",
      },
    ],
    skills: [
      {
        title: "Programming Languages",
        content: "JavaScript, Python, Java, C++",
      },
      {
        title: "Frameworks & Libraries",
        content: "React, Node.js, Express, Django",
      },
    ],
  };

  return (
    <div>
      <div className="mb-4">
        {Object.keys(cvData).map((tab) => (
          <TabButton
            key={tab}
            label={tab.charAt(0).toUpperCase() + tab.slice(1)}
            isActive={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          />
        ))}
      </div>
      <div>
        {cvData[activeTab].map((item, index) => (
          <CVSection key={index} title={item.title} content={item.content} />
        ))}
      </div>
    </div>
  );
};

export default CVInnhold;
