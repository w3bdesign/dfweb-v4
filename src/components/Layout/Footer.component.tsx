"use client";

import { IconContext } from "react-icons";
import { BiCopyright } from "react-icons/bi";

/**
 * Renders the footer for the application
 * @function Footer
 * @returns {JSX.Element} - Rendered Hamburger component
 */

const Footer = () => (
  <footer
    className="mt-6"
    aria-label="Innholdet for bunnteksten med copyright"
    data-testid="footer"
  >
    <div className="mt-8 bg-slate-800 shadow min-h-[50px]">
      <div className="w-full mx-auto p-6 text-center font-semibold">
        <div className="flex justify-center items-center space-x-2">
          <span>Copyright Daniel Fjeldstad</span>
          <IconContext.Provider value={{ className: "inline-block" }}>
            <BiCopyright size="1.2em" />
          </IconContext.Provider>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
