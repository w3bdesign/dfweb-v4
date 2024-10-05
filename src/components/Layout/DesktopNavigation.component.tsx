import React from "react";
import { MotionLi, MotionUl } from "@/lib/framer/client";
import NavigationLink from "./NavigationLink.component";
import { useNavigation } from "@/hooks/useNavigation";

interface NavigationLink {
  title: string;
  name: string;
  hash: string;
  href: string;
  externalLink: boolean;
}

interface DesktopNavigationProps {
  navigationLinks: NavigationLink[];
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ navigationLinks }) => {
  const { isLinkActive } = useNavigation(navigationLinks);

  return (
    <MotionUl
      className="hidden md:flex md:w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-slate-200 sm:w-[initial] sm:flex-nowrap sm:gap-5"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
          },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      {navigationLinks.map((link) => (
        <MotionLi
          className="h-3/4 flex items-center justify-center relative"
          key={link.name}
          variants={{
            hidden: { y: -20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 0.3 }}
        >
          <NavigationLink
            name={link.name}
            href={link.href}
            isActive={isLinkActive(link.href)}
          />
        </MotionLi>
      ))}
    </MotionUl>
  );
};

export default DesktopNavigation;