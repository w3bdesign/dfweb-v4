"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

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
  return (
    <motion.div
      className={className}
      data-testid={dataTestId}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: viewAmount }}
      transition={{
        duration,
        ease: "easeOut",
      }}
      style={{
        willChange: "opacity",
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInScroll;
