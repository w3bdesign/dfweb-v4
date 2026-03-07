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

const renderExperienceHeader = (exp: Experience): React.ReactNode => (
  <>
    {exp.period ?? ""} - {exp.company ?? ""}
  </>
);

const renderExperienceSubHeader = (exp: Experience): React.ReactNode =>
  exp.role && <p className="italic">{exp.role}</p>;

const ExperienceTabContent: React.FC<ExperienceTabContentProps> = ({
  experience,
}) => (
  <GenericCVSectionContent<Experience>
    items={experience}
    renderHeaderContent={renderExperienceHeader}
    renderSubHeaderContent={renderExperienceSubHeader}
  />
);

export default ExperienceTabContent;
