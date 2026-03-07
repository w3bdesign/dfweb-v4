"use client";

import * as m from "motion/react-m";
import { ReactNode, useRef } from "react";

export interface FadeInScrollProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  viewAmount?: "some" | "all" | number;
  "data-testid"?: string;
}

/**
 * Minimal fade-in animation triggered on scroll
 * Only uses opacity for zero CLS impact
 */
const FadeInScroll = ({
  children,
  className = "",
  duration = 0.4,
  viewAmount = 0.2,
  "data-testid": dataTestId,
}: FadeInScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <m.div
      ref={ref}
      className={className}
      data-testid={dataTestId}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: viewAmount }}
      transition={{
        duration,
        ease: "easeOut",
      }}
      onAnimationStart={() => {
        if (ref.current) ref.current.style.willChange = "opacity";
      }}
      onAnimationComplete={() => {
        if (ref.current) ref.current.style.willChange = "auto";
      }}
    >
      {children}
    </m.div>
  );
};

export default FadeInScroll;
