"use client";

import React from "react";

import { MotionDiv } from "@/lib/framer/client";

import MobileMenu from "./MobileMenu.component";
import DesktopNavigation from "./DesktopNavigation.component";

import type { Navigation } from "@/types/sanity.types";

/**
 * Header component that renders the navigation bar using links from Sanity CMS.
 * Provides both desktop and mobile navigation with animated transitions.
 * @param {Navigation} props - The navigation data object from Sanity containing menu links.
 * @returns {JSX.Element} The rendered Header component with responsive navigation.
 */
const Header: React.FC<{ navigation: Navigation }> = ({
  navigation: { links },
}): JSX.Element => {
  return (
    <header className="z-999 relative">
      <div
        className="sm:hidden w-full w-[450px] md:max-w-[36rem] bg-slate-800 bg-opacity-80 fixed top-0 left-1/2 h-[4.5rem] shadow-sm rounded-none shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:top-6 sm:h-[3.25rem] md:w-[36rem] sm:rounded-full mr-8 md:mr-0"
        style={{ transform: "translateX(-50%)" }}
      />
      <MotionDiv
        className="hidden sm:block w-full w-[450px] md:max-w-[36rem] bg-slate-800 bg-opacity-80 fixed top-0 left-1/2 h-[4.5rem] shadow-sm rounded-none shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:top-6 sm:h-[3.25rem] md:w-[36rem] sm:rounded-full mr-8 md:mr-0"
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{
          y: 0,
          x: "-51%",
          opacity: 1,
          transition: {
            y: { duration: 0.6, ease: "easeOut" },
            opacity: { duration: 0.6, ease: "easeOut" },
          },
        }}
      />
      <nav className="flex fixed top-[0.65rem] left-1/2 h-12 -translate-x-1/2 py-2 sm:top-[1.7rem] sm:h-[initial] sm:py-0 w-full max-w-[370px] justify-end md:justify-between items-center">
        <DesktopNavigation navigationLinks={links ?? []} />
        <div id="hamburger-div" data-cy="hamburger-div" className="md:hidden">
          <MobileMenu links={links ?? []} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
