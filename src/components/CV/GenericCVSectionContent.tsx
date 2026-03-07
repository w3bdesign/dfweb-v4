import React from "react";

interface BaseItem {
  description?: string;
}

interface GenericCVSectionContentProps<T extends BaseItem> {
  items?: T[];
  renderHeaderContent: (item: T) => React.ReactNode;
  renderSubHeaderContent?: (item: T) => React.ReactNode;
}

interface CVListItemProps<T extends BaseItem> {
  item: T;
  renderHeaderContent: (item: T) => React.ReactNode;
  renderSubHeaderContent?: (item: T) => React.ReactNode;
}

const CVListItem = <T extends BaseItem>({
  item,
  renderHeaderContent,
  renderSubHeaderContent,
}: CVListItemProps<T>) => (
  <div className="mb-6">
    <h3 className="font-semibold text-slate-100">
      {renderHeaderContent(item)}
    </h3>
    {renderSubHeaderContent?.(item)}
    <p>{item.description ?? ""}</p>
  </div>
);

const GenericCVSectionContent = <T extends BaseItem>({
  items,
  renderHeaderContent,
  renderSubHeaderContent,
}: GenericCVSectionContentProps<T>) => (
  <div className="text-slate-300/[0.9]">
    {items?.map((item, index) => (
      <CVListItem
        key={item.description ?? `item-${index}`}
        item={item}
        renderHeaderContent={renderHeaderContent}
        renderSubHeaderContent={renderSubHeaderContent}
      />
    ))}
  </div>
);

export default GenericCVSectionContent;
