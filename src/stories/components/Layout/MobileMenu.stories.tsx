import React from "react";
import { Meta } from "@ladle/react";
import MobileMenu from "@/components/Layout/MobileMenu.component";
import "@/app/globals.css";

export default {
  title: "Layout/MobileMenu",
  component: MobileMenu,
  meta: {
    width: "xsmall",
  },
} as Meta;

// Sample navigation links
const mockLinks = [
  {
    _key: "link1",
    title: "Home",
    name: "Home",
    href: "/",
  },
  {
    _key: "link2",
    title: "Projects",
    name: "Projects",
    href: "/prosjekter",
  },
  {
    _key: "link3",
    title: "CV",
    name: "CV",
    href: "/cv",
  },
  {
    _key: "link4",
    title: "Contact",
    name: "Contact",
    href: "/kontakt",
  },
];

// Default mobile menu
export const Default = () => (
  <div className="bg-slate-800 min-h-screen p-4">
    <div className="relative flex justify-end">
      <MobileMenu links={mockLinks} />
    </div>
    <div className="mt-32 text-gray-400 text-center">
      <p>
        Click on the hamburger menu icon in the top-right corner to open the
        mobile menu
      </p>
    </div>
  </div>
);

// Mobile menu with external link
export const WithExternalLink = () => {
  const linksWithExternal = [
    ...mockLinks,
    {
      _key: "link5",
      title: "GitHub",
      name: "GitHub",
      href: "https://github.com",
      externalLink: true,
    },
  ];

  return (
    <div className="bg-slate-800 min-h-screen p-4">
      <div className="relative flex justify-end">
        <MobileMenu links={linksWithExternal} />
      </div>
      <div className="mt-32 text-gray-400 text-center">
        <p>
          Click on the hamburger menu icon to see a menu with an external link
          to GitHub
        </p>
      </div>
    </div>
  );
};

// Mobile menu with many links
export const ManyLinks = () => {
  const manyLinks = [
    ...mockLinks,
    {
      _key: "link5",
      title: "About",
      name: "About",
      href: "/about",
    },
    {
      _key: "link6",
      title: "Blog",
      name: "Blog",
      href: "/blog",
    },
    {
      _key: "link7",
      title: "Resources",
      name: "Resources",
      href: "/resources",
    },
    {
      _key: "link8",
      title: "Gallery",
      name: "Gallery",
      href: "/gallery",
    },
  ];

  return (
    <div className="bg-slate-800 min-h-screen p-4">
      <div className="relative flex justify-end">
        <MobileMenu links={manyLinks} />
      </div>
      <div className="mt-32 text-gray-400 text-center">
        <p>Click on the hamburger menu icon to see a menu with many links</p>
      </div>
    </div>
  );
};

// Mobile menu with single link
export const SingleLink = () => (
  <div className="bg-slate-800 min-h-screen p-4">
    <div className="relative flex justify-end">
      <MobileMenu links={mockLinks.slice(0, 1)} />
    </div>
    <div className="mt-32 text-gray-400 text-center">
      <p>Click on the hamburger menu icon to see a menu with a single link</p>
    </div>
  </div>
);
