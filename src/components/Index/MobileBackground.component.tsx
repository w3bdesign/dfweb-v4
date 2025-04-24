import { motion } from "motion/react";

/**
 * MobileBackground component that renders an animated background gradient for mobile devices.
 * @returns {JSX.Element} The rendered MobileBackground component
 */
const MobileBackground = () => (
  <motion.div
    className="absolute inset-0 -top-2 -mb-2 bg-gradient-to-b from-[#000000] to-emerald-800 md:hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2.5 }}
  />
);

export default MobileBackground;
