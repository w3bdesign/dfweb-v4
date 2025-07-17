/**
 * Skeleton loader component for Hero content
 * Displays a loading placeholder that matches the Hero component's layout
 * to prevent content layout shifts when data loads from Sanity CMS
 */
const HeroSkeleton = () => {
  return (
    <article
      aria-label="Loading hero content"
      className="relative flex flex-col justify-center text-lg h-[32rem] md:h-[30rem] overflow-hidden w-full"
    >
      {/* Mobile background placeholder */}
      <div className="absolute inset-0 md:hidden bg-slate-800 animate-pulse -top-2 mb-2" />
      
      {/* Desktop background placeholder */}
      <div className="hidden md:block absolute inset-0 w-full h-full bg-slate-900 animate-pulse" />
      
      <div className="relative z-10">
        <section className="text-left md:text-center px-4 md:px-0">
          {/* Main heading skeleton */}
          <div className="flex justify-center">
            <div className="h-14 bg-slate-700 rounded w-32 animate-pulse" />
          </div>
          
          {/* Secondary heading skeleton */}
          <div className="mt-4 flex justify-center">
            <div className="h-7 bg-slate-700 rounded w-96 max-w-full animate-pulse" />
          </div>
          
          {/* Description skeleton */}
          <div className="mt-4 flex justify-center">
            <div className="h-6 bg-slate-700 rounded w-80 max-w-full animate-pulse" />
          </div>
          
          {/* Icons skeleton */}
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-4">
              <div className="h-10 w-10 bg-slate-700 rounded-full animate-pulse" />
              <div className="h-10 w-10 bg-slate-700 rounded-full animate-pulse" />
              <div className="h-10 w-10 bg-slate-700 rounded-full animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    </article>
  );
};

export default HeroSkeleton;