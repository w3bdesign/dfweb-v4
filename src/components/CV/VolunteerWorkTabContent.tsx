import React from "react";
import GenericCVSectionContent from "./GenericCVSectionContent";

interface VolunteerWork {
  period?: string;
  organization?: string;
  role?: string;
  description?: string;
}

interface VolunteerWorkTabContentProps {
  volunteerWork?: VolunteerWork[];
}

const renderVolunteerHeader = (vol: VolunteerWork): React.ReactNode => (
  <>
    {vol.period ?? ""} - {vol.organization ?? ""}
  </>
);

const renderVolunteerSubHeader = (vol: VolunteerWork): React.ReactNode =>
  vol.role && <p className="italic">{vol.role}</p>;

const VolunteerWorkTabContent: React.FC<VolunteerWorkTabContentProps> = ({
  volunteerWork,
}) => (
  <GenericCVSectionContent<VolunteerWork>
    items={volunteerWork}
    renderHeaderContent={renderVolunteerHeader}
    renderSubHeaderContent={renderVolunteerSubHeader}
  />
);

export default VolunteerWorkTabContent;
