import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MotionDiv } from "@/lib/framer/client";

interface NavigationLinkProps {
  name: string;
  href: string;
  isActive: boolean;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({ name, href, isActive }) => (
  <MotionDiv className="relative" whileHover="hover">
    <Link
      prefetch={true}
      className={`flex w-full items-center justify-center px-2 py-2 hover:text-white transition font-semibold text-lg ${
        isActive ? "text-green-400" : ""
      }`}
      href={href}
    >
      <div className="glitch relative" data-text={name}>
        {name}
        <motion.span
          className={`absolute bottom-0 left-0 h-0.5 bg-current ${
            isActive ? "bg-green-400" : "bg-white"
          }`}
          initial={{
            width: isActive ? "100%" : "0%",
          }}
          variants={{
            hover: { width: "100%" },
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </Link>
  </MotionDiv>
);

export default NavigationLink;