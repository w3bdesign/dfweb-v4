"use client";

import React from "react";
import { MotionDiv } from "@/lib/framer/client";
import MobileMenu from "./MobileMenu.component";
import DesktopNavigation from "./DesktopNavigation.component";

interface NavigationLink {
  title: string;
  name: string;
  hash: string;
  href: string;
  externalLink: boolean;
}

interface HeaderProps {
  navigationLinks: NavigationLink[];
}

/**
 * Header component that renders the navigation bar
 * @param {HeaderProps} props - The props for the Header component
 * @param {NavigationLink[]} props.navigationLinks - Array of navigation links
 * @returns {JSX.Element} The rendered Header component
 */
const Header: React.FC<HeaderProps> = ({ navigationLinks }) => {
  return (
    <header className="z-[999] relative">
      <div
        className="sm:hidden w-full w-[450px] md:max-w-[36rem] bg-slate-800 bg-opacity-80 fixed top-0 left-1/2 h-[4.5rem] shadow rounded-none shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:top-6 sm:h-[3.25rem] md:w-[36rem] sm:rounded-full mr-8 md:mr-0"
        style={{ transform: "translateX(-50%)" }}
      />
      <MotionDiv
        className="hidden sm:block w-full w-[450px] md:max-w-[36rem] bg-slate-800 bg-opacity-80 fixed top-0 left-1/2 h-[4.5rem] shadow rounded-none shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:top-6 sm:h-[3.25rem] md:w-[36rem] sm:rounded-full mr-8 md:mr-0"
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
        <DesktopNavigation navigationLinks={navigationLinks} />
        <div id="hamburger-div" data-cy="hamburger-div" className="md:hidden">
          <MobileMenu links={navigationLinks} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
