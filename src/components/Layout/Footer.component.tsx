"use client";

import { IconContext } from "react-icons";
import { BiCopyright } from "react-icons/bi";

import type { Settings } from "@/types/sanity.types";

type FooterProps = Pick<Settings, 'footerCopyrightText'>;

/**
 * Renders the footer for the application
 * @param {FooterProps} props - The props for the Footer component, containing only footerCopyrightText from Settings.
 * @param {string} [props.footerCopyrightText] - The copyright text from Sanity settings (optional)
 * @returns {JSX.Element} - Rendered Footer component
 */
const Footer = ({ footerCopyrightText }: FooterProps) => (
  <footer
    className="mt-8"
    aria-label="Innholdet for bunnteksten med copyright"
    data-testid="footer"
  >
    <div className="bg-slate-800 shadow-sm min-h-[50px]">
      <div className="w-full mx-auto p-6 text-center font-semibold">
        <div className="flex justify-center items-center space-x-2">
          <span>{footerCopyrightText}</span>
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
