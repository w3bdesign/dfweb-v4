import React from "react";

interface BaseItem {
  description?: string;
}

interface GenericCVSectionContentProps<T extends BaseItem> {
  items?: T[];
  renderHeaderContent: (item: T) => React.ReactNode;
  renderSubHeaderContent?: (item: T) => React.ReactNode;
}

const GenericCVSectionContent = <T extends BaseItem>({
  items,
  renderHeaderContent,
  renderSubHeaderContent,
}: GenericCVSectionContentProps<T>) => (
  <div className="text-slate-300/[0.9]">
    {items?.map((item, index) => (
      <div key={item.description ?? `item-${index}`} className="mb-6">
        <h3 className="font-semibold text-slate-100">
          {renderHeaderContent(item)}
        </h3>
        {renderSubHeaderContent && renderSubHeaderContent(item)}
        <p>{item.description ?? ""}</p>
      </div>
    ))}
  </div>
);

export default GenericCVSectionContent;
