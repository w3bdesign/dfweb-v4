import React from "react";

interface Experience {
  period?: string;
  company?: string;
  role?: string;
  description?: string;
}

interface ExperienceTabContentProps {
  experience?: Experience[];
}

const ExperienceTabContent: React.FC<ExperienceTabContentProps> = ({ experience }) => (
  <div className="text-slate-300/[0.9]">
    {experience?.map((exp) => (
      <div key={exp.description ?? ""} className="mb-6">
        <h3 className="font-semibold text-slate-100">
          {exp.period ?? ""} - {exp.company ?? ""}
        </h3>
        {exp.role && <p className="italic">{exp.role}</p>}
        <p>{exp.description ?? ""}</p>
      </div>
    ))}
  </div>
);

export default ExperienceTabContent;
