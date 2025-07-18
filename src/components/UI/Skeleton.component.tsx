import { type ReactNode } from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
  children?: ReactNode;
  shimmer?: boolean;
  "data-testid"?: string;
}

const Skeleton = ({
  width = "w-full",
  height = "h-4",
  className = "",
  rounded = false,
  children,
  shimmer = true,
  "data-testid": dataTestId,
}: SkeletonProps) => {
  if (children) {
    return (
      <div
        className={`animate-pulse ${className}`}
        data-testid={dataTestId || "skeleton"}
      >
        {children}
      </div>
    );
  }

  const baseClasses = shimmer
    ? "relative overflow-hidden bg-slate-700 skeleton-shimmer"
    : "animate-pulse bg-slate-700";
  const shapeClasses = rounded ? "rounded-full" : "rounded";

  return (
    <div
      className={`${baseClasses} ${shapeClasses} ${width} ${height} ${className}`}
      data-testid={dataTestId || "skeleton"}
      style={{
        contain: "layout style paint",
      }}
    />
  );
};

export default Skeleton;
