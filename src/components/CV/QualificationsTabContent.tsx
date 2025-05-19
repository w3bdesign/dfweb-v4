import React from "react";

interface QualificationsTabContentProps {
  qualifications?: string[];
}

const QualificationsTabContent: React.FC<QualificationsTabContentProps> = ({ qualifications }) => (
  <ul className="list-disc pl-5 text-slate-300/[0.9]">
    {qualifications?.map((qual) => (
      <li key={qual ?? ""} className="mb-2">
        {qual ?? ""}
      </li>
    ))}
  </ul>
);

export default QualificationsTabContent;
