import SectionSkeleton from "./SectionSkeleton.component";

/**
 * Loading skeleton for IndexContent component
 * Displays placeholder content that matches the actual layout
 * to prevent layout shifts when content loads from Sanity CMS
 */
const IndexContentLoader = () => {
  // Display 3 skeleton sections to approximate typical content
  return (
    <div className="w-full overflow-hidden -mb-8">
      <SectionSkeleton variant="default" />
      <SectionSkeleton variant="alternate" />
      <SectionSkeleton variant="default" />
    </div>
  );
};

export default IndexContentLoader;
