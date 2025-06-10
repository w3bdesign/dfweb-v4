import React from "react";
import { usePathname } from "next/navigation";
import { MotionLi, MotionUl } from "@/lib/framer/client";
import NavigationLinkComponent from "./NavigationLink.component";

import type { Navigation } from "@/types/sanity.types";

type NavigationLinksArray = NonNullable<Navigation["links"]>;

const DesktopNavigation: React.FC<{
  navigationLinks: NavigationLinksArray;
}> = ({ navigationLinks }) => {
  const pathname = usePathname();
  const isLinkActive = (href: string) => pathname === href;

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
          key={link._key ?? link.title}
          variants={{
            hidden: { y: -20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 0.3 }}
        >
          <NavigationLinkComponent
            name={link.title ?? ""}
            href={link.href ?? ""}
            isActive={isLinkActive(link.href ?? "")}
          />
        </MotionLi>
      ))}
    </MotionUl>
  );
};

export default DesktopNavigation;
