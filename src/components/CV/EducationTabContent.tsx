import React from "react";
import GenericCVSectionContent from "./GenericCVSectionContent";

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
  <GenericCVSectionContent<Education>
    items={education}
    renderHeaderContent={(edu) => <>{edu.period ?? ""} - {edu.institution ?? ""}</>}
    renderSubHeaderContent={(edu) => edu.degree && <p className="italic">{edu.degree}</p>}
  />
);

export default EducationTabContent;
