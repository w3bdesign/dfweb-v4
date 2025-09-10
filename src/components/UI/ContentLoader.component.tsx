import Skeleton from "./Skeleton.component";

interface ContentLoaderProps {
  /** Type of content being loaded */
  type?: "hero" | "section" | "custom";
  /** Number of sections to show (for section type) */
  sections?: number;
  /** Custom content for flexibility */
  children?: React.ReactNode;
}

const ContentLoader = ({
  type = "section",
  sections = 1,
  children,
}: ContentLoaderProps) => {
  if (type === "custom" && children) {
    return <>{children}</>;
  }

  if (type === "hero") {
    return (
      <div className="relative flex flex-col justify-center text-lg h-[32rem] md:h-[30rem] overflow-hidden w-full">
        <div className="absolute inset-0 bg-slate-800 md:bg-slate-900" />
        <div className="relative z-10 text-center px-4 md:px-0 space-y-4">
          <Skeleton height="h-14" width="w-32 mx-auto" shimmer />
          <Skeleton height="h-7" width="w-96 max-w-full mx-auto" shimmer />
          <Skeleton height="h-6" width="w-80 max-w-full mx-auto" shimmer />
          <div className="flex justify-center space-x-4 mt-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="h-10 w-10" rounded shimmer />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default to section loader
  return (
    <div className="w-full overflow-hidden -mb-8">
      {Array.from({ length: sections }, (_, index) => (
        <div
          key={index}
          data-testid="content-section"
          className={`md:py-6 relative contain-layout ${
            index % 2 === 0 ? "bg-slate-900" : "bg-slate-800/30"
          }`}
        >
          <div className="p-6 md:p-2 max-w-7xl mx-auto space-y-4">
            <Skeleton height="h-9" width="w-48 mx-auto" shimmer />
            <div className="max-w-3xl mx-auto space-y-3 mt-4">
              <Skeleton shimmer />
              <Skeleton width="w-5/6" shimmer />
              <Skeleton width="w-4/6" shimmer />
              <Skeleton shimmer />
              <Skeleton width="w-3/4" shimmer />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentLoader;
