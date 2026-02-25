import * as m from "motion/react-m";
import { ReactNode } from "react";

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
  return (
    <m.div
      className={className}
      data-testid={dataTestId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      style={{
        willChange: "opacity",
      }}
    >
      {children}
    </m.div>
  );
};

export default FadeIn;
