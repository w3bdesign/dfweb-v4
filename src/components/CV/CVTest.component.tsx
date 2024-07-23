"use client" 

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

const CVContent = () => {
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
    <main id="maincontent" className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Interactive CV</h1>
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
      <div className="mt-8 flex justify-center space-x-4">
        <a
          href="./cv.pdf"
          download
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download PDF
        </a>
        <a
          href="#"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          View Full CV
        </a>
      </div>
    </main>
  );
};

export default CVContent;
