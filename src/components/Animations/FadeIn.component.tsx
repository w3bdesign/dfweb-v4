import * as m from "motion/react-m";
import { ReactNode, useRef } from "react";
import { createWillChangeHandlers } from "./animation-utils";

export interface FadeInProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  "data-testid"?: string;
}

/**
 * Minimal fade-in animation component
 * Only uses opacity for zero CLS impact
 */
const FadeIn = ({
  children,
  className = "",
  duration = 1,
  delay = 0,
  "data-testid": dataTestId,
}: FadeInProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { onAnimationStart, onAnimationComplete } =
    createWillChangeHandlers(ref);

  return (
    <m.div
      ref={ref}
      className={className}
      data-testid={dataTestId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </m.div>
  );
};

export default FadeIn;
