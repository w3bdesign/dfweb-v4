"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, useCycle, motion } from "motion/react";

import Hamburger from "./Hamburger.component";

import useClickOutside from "@/hooks/useClickOutside";

interface ILink {
  title: string;
  name: string;
  hash: string;
  href: string;
  externalLink: boolean;
}

interface IMobileMenuProps {
  links: ILink[];
}

/**
 * MobileMenu component that renders a responsive navigation menu for mobile devices
 * @param {Object} props
 * @param {ILink[]} props.links - Array of navigation link objects
 * @returns {JSX.Element} The rendered MobileMenu component
 */

const MobileMenu = ({ links }: IMobileMenuProps) => {
  const [isExpanded, setisExpanded] = useCycle<boolean>(false, true);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const handleClickOutside = () => {
    setisExpanded(0);
  };

  useClickOutside(ref, handleClickOutside);

  const menuVariants = {
    closed: {
      x: "125%",
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 10,
        delay: 0.3,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 10,
      },
    },
  };

  const itemVariants = {
    closed: (i: number) => ({
      x: i % 2 === 0 ? "-50%" : "50%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        duration: 0.25,
      },
    }),
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        delay: i * 0.25,
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
            className="fixed top-0 right-0 w-[calc(100vw+20px)] h-[calc(100vh+20px)] bg-gray-800 flex items-center justify-center -z-10 -mt-4"
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
                {links.map(({ title, name, href, externalLink }, index) => (
                  <motion.li
                    key={title}
                    className="block p-4 text-xl text-white mx-auto text-center border-t border-b border-gray-600 border-solid shadow"
                    data-cy="mobile-menu-item"
                    custom={index}
                    variants={itemVariants}
                  >
                    {externalLink ? (
                      <a
                        aria-label={name}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        data-testid={`mobil-${name}`}
                        className="flex w-full items-center justify-center px-2 py-2 hover:text-white transition font-semibold text-lg"
                      >
                        {name}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        data-testid={`mobil-${name}`}
                        prefetch={true}
                        className={`flex w-full items-center justify-center px-2 py-2 hover:text-white transition font-semibold text-lg ${
                          pathname === href ? "text-green-400" : ""
                        }`}
                      >
                        <div className="glitch relative" data-text={name}>
                          {name}
                          <motion.span
                            className={`absolute bottom-0 left-0 h-0.5 bg-current ${
                              pathname === href ? "bg-green-400" : "bg-white"
                            }`}
                            initial={{
                              width: pathname === href ? "100%" : "0%",
                            }}
                            animate={{
                              width: pathname === href ? "100%" : "0%",
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
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
