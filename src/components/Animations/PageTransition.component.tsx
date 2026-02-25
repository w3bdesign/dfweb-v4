import { Variants, AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

import { IAnimateProps } from "./types/Animations.types";

/**
 * Fade in animation used for page transitions
 * @function PageTransition
 * @param {ReactNode} children - Children content to render
 * @param {string} cssClass - CSS classes to apply to component
 * @returns {JSX.Element} - Rendered component
 */

const PageTransition = ({ children, cssClass }: IAnimateProps) => {
  const pageTransitionVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1.0 } },
    exit: { opacity: 0 },
  };
  return (
    <AnimatePresence mode="wait">
      <m.div
        className={cssClass}
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        data-testid="pagetransition"
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
};

export default PageTransition;
