"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { MotionDiv, MotionLi } from "@/lib/framer/client";

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const links = [
    {
      title: "Home",
      name: "Hjem",
      hash: "#hjem",
      href: "/",
    },
    {
      title: "Prosjekter",
      name: "Prosjekter",
      hash: "#prosjekter",
      href: "/prosjekter",
    },
    {
      title: "CV",
      name: "CV",
      hash: "#cv",
      href: "/cv",
    },
    {
      title: "Github",
      name: "Github",
      hash: "#github",
      href: "https://github.com/w3bdesign",
    },
    {
      title: "Kontakt",
      name: "Kontakt",
      hash: "#kontakt",
      href: "/kontakt",
    },
  ];

  return (
    <header className="z-[999] relative">
      <MotionDiv
        className="bg-primaryButtonBg fixed top-0 left-1/2 h-[4.5rem] w-full shadow rounded-none bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:top-6 sm:h-[3.25rem] sm:w-[36rem] sm:rounded-full dark:bg-gray-950 dark:border-black/40 dark:bg-opacity-75"
        initial={{ y: -50, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1, transition: { duration: 0.6 } }}
      ></MotionDiv>

      <nav className="flex fixed top-[0.65rem] left-1/2 h-12 -translate-x-1/2 py-2 sm:top-[1.7rem] sm:h-[initial] sm:py-0 w-[370px]">
        <ul className="flex md:w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-white sm:w-[initial] sm:flex-nowrap sm:gap-5">
          {links.map((link) => (
            <MotionLi
              className="h-3/4 flex items-center justify-center relative"
              key={link.hash}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.6 } }}
            >
              <Link
                prefetch={true}
                className="flex w-full items-center justify-center px-2 py-2 hover:text-gray-950 transition dark:text-gray-500 dark:hover:text-gray-300 font-semibold text-lg"
                href={link.href}
              >
                <div
                  className={clsx("glitch", {
                    "underline underline-offset-4 decoration-2":
                      pathname === link.href,
                  })}
                  data-text={link.name}
                >
                  {link.name}
                </div>
              </Link>
            </MotionLi>
          ))}
        </ul>
      </nav>
    </header>
  );
}
