import { type ReactNode } from "react";

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
  children?: ReactNode;
}

const Skeleton = ({
  width = "w-full",
  height = "h-4",
  className = "",
  rounded = false,
  children,
}: SkeletonProps) => {
  if (children) {
    return <div className={`animate-pulse ${className}`}>{children}</div>;
  }

  const baseClasses = "animate-pulse bg-slate-700";
  const shapeClasses = rounded ? "rounded-full" : "rounded";

  return (
    <div
      className={`${baseClasses} ${shapeClasses} ${width} ${height} ${className}`}
    />
  );
};

export default Skeleton;
