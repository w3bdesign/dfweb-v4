"use client";

import { Variants, motion } from "framer-motion";
import { IAnimateBounceProps } from "./types/Animations.types";

const bounceVariants: Variants = {
  offscreen: {
    opacity: 0,
    scale: 0.98,
  },
  onscreen: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
      duration: 0.5,
    },
  },
};

const BounceInScroll = ({
  children,
  cssClass,
  viewAmount,
}: IAnimateBounceProps) => (
  <motion.div
    initial="offscreen"
    whileInView="onscreen"
    viewport={{ once: true, amount: viewAmount || 0.2 }}
    className={`${cssClass} overflow-hidden`} // Added overflow-hidden
    data-testid="bounceinscroll"
  >
    <motion.div variants={bounceVariants}>{children}</motion.div>
  </motion.div>
);

export default BounceInScroll;