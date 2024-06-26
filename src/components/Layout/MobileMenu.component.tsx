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
 * Renders the mobile menu.
 * Animates the X when clicked, and animates the menu items with Framer Motion
 * @function MobileMenu
 * @returns {JSX.Element} - Rendered component
 */

const MobileMenu = ({ links }: IMobileMenuProps) => {
  const [isExpanded, setisExpanded] = useCycle<boolean>(false, true);
  const ref = useRef(null);

  const handleClickOutside = () => {
    setisExpanded(0);
  };

  useClickAway(ref, handleClickOutside);

  const itemVariants = {
    closed: {
      opacity: 0,
    },
    open: { opacity: 1 },
  };

  const sideVariants = {
    closed: {
      transition: {
        staggerChildren: 0.3,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        staggerChildren: 0.3,
        staggerDirection: 1,
      },
    },
  };

  return (
    <div
      ref={ref}
      className="z-50 md:hidden lg:hidden xl:hidden"
      data-testid="mobilemenu"
    >
      <Hamburger onClick={setisExpanded} animatetoX={isExpanded} />
      <div
        id="mobile-menu"
        data-testid="mobile-menu"
        data-cy="mobile-menu"
        aria-hidden={!isExpanded}
        className="absolute right-0 w-full text-center bg-gray-800 mt-4 w-30"
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.aside
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: links.length * 62, // Adjust the height based on the number of links
                opacity: 1,
                transition: { delay: 0.15, duration: 1.6, ease: "easeInOut" },
              }}
              exit={{
                height: 0,
                transition: { delay: 0.15, duration: 1.6, ease: "easeInOut" },
              }}
            >
              <nav aria-label="Navigasjon">
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={sideVariants}
                >
                  <ul>
                    {links.map(({ title, name, hash, href }) => (
                      <motion.li
                        key={title}
                        className="block p-4 text-xl text-white hover:underline mx-auto text-center border-t border-b border-gray-600 border-solid shadow"
                        data-cy="mobile-menu-item"
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
                          <Link href={href} data-testid={`mobil-${name}`}>
                            {name}
                          </Link>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MobileMenu;