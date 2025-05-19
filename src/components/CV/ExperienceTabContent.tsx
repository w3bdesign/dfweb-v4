import React from "react";
import GenericCVSectionContent from "./GenericCVSectionContent";

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
  <GenericCVSectionContent<Experience>
    items={experience}
    renderHeaderContent={(exp) => <>{exp.period ?? ""} - {exp.company ?? ""}</>}
    renderSubHeaderContent={(exp) => exp.role && <p className="italic">{exp.role}</p>}
  />
);

export default ExperienceTabContent;
