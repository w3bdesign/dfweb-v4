import React from "react";

interface Education {
  period?: string;
  institution?: string;
  degree?: string;
  description?: string;
}

interface EducationTabContentProps {
  education?: Education[];
}

const EducationTabContent: React.FC<EducationTabContentProps> = ({ education }) => (
  <div className="text-slate-300/[0.9]">
    {education?.map((edu) => (
      <div key={edu.description ?? ""} className="mb-6">
        <h3 className="font-semibold text-slate-100">
          {edu.period ?? ""} - {edu.institution ?? ""}
        </h3>
        {edu.degree && <p className="italic">{edu.degree}</p>}
        <p>{edu.description ?? ""}</p>
      </div>
    ))}
  </div>
);

export default EducationTabContent;
