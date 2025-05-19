import React from "react";
import { Meta } from "@ladle/react";
import CVContent from "@/components/CV/CVContent.component";
import { Cv } from "@/types/sanity.types";
import "@/app/globals.css";

export default {
  title: "CV/CVContent",
  component: CVContent,
} as Meta;

// Mock CV data that matches the Sanity Cv type
const mockCvData: Cv = {
  _id: "mock-cv-1",
  _type: "cv" as const,
  _createdAt: "2023-01-01T00:00:00Z",
  _updatedAt: "2023-01-01T00:00:00Z",
  _rev: "revision-1",
  keyQualifications: [
    "Frontend development with React/Next.js",
    "TypeScript and JavaScript expertise",
    "UI/UX design principles",
    "Performance optimization",
    "Accessibility implementation",
  ],
  experience: [
    {
      _key: "exp-1",
      period: "2020 - Present",
      company: "Tech Solutions Inc.",
      role: "Senior Frontend Developer",
      description:
        "Leading development of modern web applications using React and Next.js.",
    },
    {
      _key: "exp-2",
      period: "2017 - 2020",
      company: "Digital Innovations",
      role: "Frontend Developer",
      description:
        "Developed responsive websites and web applications for various clients.",
    },
    {
      _key: "exp-3",
      period: "2015 - 2017",
      company: "WebCraft",
      role: "Junior Developer",
      description:
        "Assisted in the development and maintenance of company websites.",
    },
  ],
  education: [
    {
      _key: "edu-1",
      period: "2011 - 2015",
      institution: "University of Technology",
      degree: "Bachelor of Computer Science",
      description: "Focused on web development and user interface design.",
    },
    {
      _key: "edu-2",
      period: "2009 - 2011",
      institution: "Technical College",
      degree: "Associate's Degree in Web Development",
      description: "Core curriculum in HTML, CSS, and JavaScript.",
    },
  ],
  volunteerWork: [
    {
      _key: "vol-1",
      period: "2019 - Present",
      organization: "Code for Community",
      role: "Mentor",
      description: "Teaching coding skills to underrepresented groups in tech.",
    },
    {
      _key: "vol-2",
      period: "2016 - 2018",
      organization: "Tech Education Foundation",
      role: "Workshop Facilitator",
      description:
        "Conducted workshops on web development basics for high school students.",
    },
  ],
};

// Basic CV content story
export const Default = () => <CVContent cvData={mockCvData} />;

// CV with long content
export const ExtensiveCV = () => {
  const extensiveData: Cv = {
    ...mockCvData,
    _id: "mock-cv-extensive",
    keyQualifications: [
      ...(mockCvData.keyQualifications || []),
      "Backend integration with Node.js",
      "Database design and management",
      "GraphQL API development",
      "Docker containerization",
      "CI/CD pipeline implementation",
      "AWS cloud services",
      "Agile methodology",
      "Team leadership",
    ],
    experience: [
      ...(mockCvData.experience || []),
      {
        _key: "exp-4",
        period: "2013 - 2015",
        company: "StartupHub",
        role: "Intern",
        description:
          "Learned fundamentals of web development in a startup environment.",
      },
      {
        _key: "exp-5",
        period: "2011 - 2013",
        company: "Freelance",
        role: "Web Developer",
        description: "Created websites for small businesses and individuals.",
      },
    ],
  };

  return <CVContent cvData={extensiveData} />;
};
