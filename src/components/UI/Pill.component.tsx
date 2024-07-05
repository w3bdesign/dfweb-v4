import Link from "next/link";
import React from "react";

interface PillProps {
  href: string;
  text: string;
  className?: string;
}

const Pill: React.FC<PillProps> = ({ href, text, className = "" }) => {
  return (
    <Link
      href={href}
      className={`glitch text-white m-4 text-xl p-6 mt-4 rounded-full transition duration-300 ease-in-out transform
                 bg-blue-600 bg-opacity-20 border-2 border-blue-800 border-opacity-30                     
                 hover:bg-blue-400 hover:bg-opacity-30
                 hover:shadow-[0_0_15px_rgba(0,255,255,0.1),0_0_20px_rgba(0,255,255,0.1),inset_0_0_20px_rgba(0,255,255,0.1)]
                 backdrop-blur-sm ${className}`}
      data-text={text}
    >
      {text}
    </Link>
  );
};

export default Pill;
