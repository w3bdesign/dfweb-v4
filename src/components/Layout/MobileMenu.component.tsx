"use client";

import { useRef } from "react";
import { useClickAway } from "react-use";
import Link from "next/link";

import { AnimatePresence, useCycle, motion } from "framer-motion";

import Hamburger from "./Hamburger.component";

interface ILink {
  title: string;
  name: string;
  hash: string;
  href: string;
}

interface IMobileMenuProps {
  links: ILink[];
}

/**
 * Renders the mobile menu component with animation and navigation links.
 *
 * @param {IMobileMenuProps} links - Array of navigation links
 * @return {JSX.Element} - Rendered mobile menu component
 */
const MobileMenu = ({ links }: IMobileMenuProps) => {
  const [isExpanded, setisExpanded] = useCycle<boolean>(false, true);
  const ref = useRef(null);

  const handleClickOutside = () => {
    setisExpanded(0);
  };

  useClickAway(ref, handleClickOutside);

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        delay: 0.2,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const itemVariants = {
      /**
       * Returns an object with the CSS properties for a closed animation.
       *
       * @param {number} i - The index of the item being animated.
       * @return {Object} An object with CSS properties for the closed animation.
       */
    closed: (i: number) => ({
      x: i % 2 === 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.15,
      },
    }),
/**
 * Returns an object representing the animation properties for opening an item.
 *
 * @param {number} i - The index of the item.
 * @return {object} An object with the following properties:
 *   - x: The x-coordinate of the item.
 *   - opacity: The opacity of the item.
 *   - transition: An object representing the animation properties.
 *     - type: The type of the animation.
 *     - stiffness: The stiffness of the animation.
 *     - damping: The damping of the animation.
 *     - delay: The delay of the animation.
 */
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: i * 0.05,
      },
    }),
  };

  return (
    <div
      ref={ref}
      className="z-50 md:hidden lg:hidden xl:hidden"
      data-testid="mobilemenu"
    >
      <Hamburger onClick={setisExpanded} animatetoX={isExpanded} />
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="mobile-menu"
            data-testid="mobile-menu"
            data-cy="mobile-menu"
            aria-hidden={!isExpanded}
            className="fixed top-0 right-0 w-screen h-screen bg-gray-800 flex items-center justify-center -z-10"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <nav aria-label="Navigasjon" className="w-full">
              <motion.ul
                className="w-full"
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
                  },
                  closed: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 },
                  },
                }}
              >
                {links.map(({ title, name, hash, href }, index) => (
                  <motion.li
                    key={title}
                    className="block p-4 text-xl text-white hover:underline mx-auto text-center border-t border-b border-gray-600 border-solid shadow"
                    data-cy="mobile-menu-item"
                    custom={index}
                    variants={itemVariants}
                  >
                    {href.startsWith("http") ? (
                      <a
                        aria-label={name}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        data-testid={`mobil-${name}`}
                      >
                        {name}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        data-testid={`mobil-${name}`}
                        prefetch={true}
                      >
                        {name}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </motion.ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;
