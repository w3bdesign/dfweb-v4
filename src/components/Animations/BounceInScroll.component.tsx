"use client";

import { useMemo } from "react";
import { Variants } from "motion/react";
import * as m from "motion/react-m";

import { IAnimateBounceProps } from "./types/Animations.types";

/**
 * Creates bounce variants with an optional stagger delay for coordinated group animations.
 * @param {number} delay - Delay in seconds before the animation starts
 * @returns {Variants} Motion variants with the specified delay
 */
function createBounceVariants(delay: number): Variants {
  return {
    offscreen: {
      y: 30,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.5,
        duration: 1.5,
        delay,
      },
    },
  };
}

/**
 * Bounce in content when content becomes visible in viewport
 * @function BounceInScroll
 * @param {ReactNode} children - Children content to render
 * @param {string} cssClass - CSS classes to apply to component
 * @param {"some" | "all" | number} viewAmount - Amount of component needed to be visible before animating
 * @param {boolean} instant - Whether to animate instantly without scroll trigger
 * @param {number} delay - Stagger delay in seconds for coordinated group animations
 * @returns {JSX.Element} - Rendered component
 */

const BounceInScroll = ({
  children,
  cssClass,
  viewAmount,
  instant,
  delay = 0,
}: IAnimateBounceProps) => {
  const variants = useMemo(() => createBounceVariants(delay), [delay]);

  return (
    <m.div
      initial="offscreen"
      animate={instant ? "onscreen" : undefined}
      whileInView={instant ? undefined : "onscreen"}
      viewport={
        instant ? undefined : { once: true, amount: viewAmount ?? 0.2 }
      }
      className={cssClass}
      data-testid="bounceinscroll"
    >
      <m.div variants={variants}>{children}</m.div>
    </m.div>
  );
};

export default BounceInScroll;
