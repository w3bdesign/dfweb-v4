import { motion } from "motion/react";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}

/**
 * Minimal fade-in animation component
 * Only uses opacity for zero CLS impact
 */
const FadeIn = ({
  children,
  className = "",
  duration = 0.3,
  delay = 0,
}: FadeInProps) => {
  return (
    <motion.div
      className={className}
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
    </motion.div>
  );
};

export default FadeIn;
