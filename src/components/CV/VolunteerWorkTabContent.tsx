import React from "react";

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
  <div className="text-slate-300/[0.9]">
    {volunteerWork?.map((vol) => (
      <div key={vol.description ?? ""} className="mb-6">
        <h3 className="font-semibold text-slate-100">
          {vol.period ?? ""} - {vol.organization ?? ""}
        </h3>
        {vol.role && <p className="italic">{vol.role}</p>}
        <p>{vol.description ?? ""}</p>
      </div>
    ))}
  </div>
);

export default VolunteerWorkTabContent;
