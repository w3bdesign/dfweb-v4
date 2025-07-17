/**
 * Skeleton loader component for Section content
 * Displays a loading placeholder that matches the Section component's layout
 * to prevent content layout shifts when data loads from Sanity CMS
 */
const SectionSkeleton = ({
  variant = "default",
}: {
  variant?: "default" | "alternate";
}) => {
  const sectionStyles = {
    default: "bg-slate-900",
    alternate: "bg-slate-800/30",
  };

  return (
    <section
      aria-label="Loading content"
      className={`
        md:py-6 
        relative
        transition-colors
        duration-300
        ${sectionStyles[variant]}
        animate-pulse
      `}
    >
      <div className="p-6 md:p-2 text-lg h-full max-w-7xl mx-auto">
        {/* Title skeleton */}
        <div className="h-9 bg-slate-700 rounded w-48 mx-auto mb-4" />

        {/* Content skeleton */}
        <div className="flex justify-center">
          <div className="mt-4 text-lg text-left md:max-w-3xl w-full space-y-3">
            <div className="h-4 bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-700 rounded w-5/6" />
            <div className="h-4 bg-slate-700 rounded w-4/6" />
            <div className="h-4 bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-700 rounded w-3/4" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionSkeleton;
