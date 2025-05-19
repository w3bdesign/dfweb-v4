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

const VolunteerWorkTabContent: React.FC<VolunteerWorkTabContentProps> = ({ volunteerWork }) => (
  <GenericCVSectionContent<VolunteerWork>
    items={volunteerWork}
    renderHeaderContent={(vol) => <>{vol.period ?? ""} - {vol.organization ?? ""}</>}
    renderSubHeaderContent={(vol) => vol.role && <p className="italic">{vol.role}</p>}
  />
);

export default VolunteerWorkTabContent;
