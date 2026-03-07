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

const renderEducationHeader = (edu: Education): React.ReactNode => (
  <>
    {edu.period ?? ""} - {edu.institution ?? ""}
  </>
);

const renderEducationSubHeader = (edu: Education): React.ReactNode =>
  edu.degree && <p className="italic">{edu.degree}</p>;

const EducationTabContent: React.FC<EducationTabContentProps> = ({
  education,
}) => (
  <GenericCVSectionContent<Education>
    items={education}
    renderHeaderContent={renderEducationHeader}
    renderSubHeaderContent={renderEducationSubHeader}
  />
);

export default EducationTabContent;
