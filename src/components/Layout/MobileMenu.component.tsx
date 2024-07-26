"use client";

import { useRef, useEffect, useState } from "react";
import { useClickAway } from "react-use";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AnimatePresence, useCycle, motion } from "framer-motion";

import Hamburger from "./Hamburger.component";
import { client } from "@/lib/sanity/client";
import { navigationQuery } from "@/lib/sanity/queries";

const MobileMenu = () => {
  const [isExpanded, setisExpanded] = useCycle<boolean>(false, true);
  const ref = useRef(null);
  const pathname = usePathname();
  const [links, setLinks] = useState([]);

  const handleClickOutside = () => {
    setisExpanded(0);
  };

  useClickAway(ref, handleClickOutside);

  useEffect(() => {
    const fetchNavigation = async () => {
      const data = await client.fetch(navigationQuery);
      setLinks(data[0]?.navigation || []);
    };

    fetchNavigation();
  }, []);

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        delay: 0.3,
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
    closed: (i: number) => ({
      x: i % 2 === 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.25,
      },
    }),
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
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
                {links.map(({ title, url, external }, index) => (
                  <motion.li
                    key={title}
                    className="block p-4 text-xl text-white mx-auto text-center border-t border-b border-gray-600 border-solid shadow"
                    data-cy="mobile-menu-item"
                    custom={index}
                    variants={itemVariants}
                  >
                    {external ? (
                      <a
                        aria-label={title}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        data-testid={`mobil-${title}`}
                        className="flex w-full items-center justify-center px-2 py-2 hover:text-white transition font-semibold text-lg"
                      >
                        {title}
                      </a>
                    ) : (
                      <Link
                        href={url}
                        data-testid={`mobil-${title}`}
                        prefetch={true}
                        className={`flex w-full items-center justify-center px-2 py-2 hover:text-white transition font-semibold text-lg ${
                          pathname === url ? "text-green-400" : ""
                        }`}
                      >
                        <div className="glitch relative" data-text={title}>
                          {title}
                          <motion.span
                            className={`absolute bottom-0 left-0 h-0.5 bg-current ${
                              pathname === url ? "bg-green-400" : "bg-white"
                            }`}
                            initial={{
                              width: pathname === url ? "100%" : "0%",
                            }}
                            animate={{
                              width: pathname === url ? "100%" : "0%",
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
