"use client";

import React from "react";
import Button from "@/components/UI/Button.component";
import BounceInScroll from "@/components/Animations/BounceInScroll.component";

import { urlFor } from "@/lib/sanity/helpers";

import type { Project } from "@/types/sanity.types";

/**
 * ProsjektCard component that renders a card for a project
 * @param {Object} props
 * @param {string} props.name - The name of the project
 * @param {string} props.description - A brief description of the project
 * @param {string} props.subdescription - Additional description of the project
 * @param {Object} props.projectimage - The image object for the project
 * @param {Array} props.urlwww - Array of website URLs for the project
 * @param {Array} props.urlgithub - Array of GitHub URLs for the project
 * @returns {JSX.Element} The rendered ProsjektCard component
 */

const ProsjektCard: React.FC<Project> = ({
  name,
  description,
  subdescription,
  projectimage,
  urlwww,
  urlgithub,
  featured,
}) => {
  return (
    <div
      className="bg-slate-700 shadow-md rounded overflow-hidden mx-4 md:m-0"
      data-testid="projectcard"
    >
      <BounceInScroll viewAmount={0.3} instant={featured}>
        <div className="relative w-full h-48 md:h-60">
          <div className="w-full h-full p-5 md:pb-[20px] relative overflow-hidden flex justify-center md:h-[340px]">
            {projectimage && (
              <img
                className="transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_2px_20px_rgba(60,255,60,0.35)]"
                width="600"
                height="340"
                src={urlFor(projectimage).url() as string}
                alt={name}
              />
            )}
          </div>
        </div>
        <div className="md:mt-16 p-2 flex flex-col justify-between min-h-[250px] xl:min-h-[275px]">
          <h1 className="xl:mt-4 text-xl text-center font-bold py-2 text-slate-100">
            {name}
          </h1>
          <h2 className="text-md px-4 text-gray-300">{description}</h2>
          <p className="mt-4 text-sm mt-2 px-4 text-gray-300">
            {subdescription}
          </p>
          <div className="flex justify-center mt-4">
            {urlwww && urlwww.length > 0 && (
              <Button href={urlwww[0].url} renderAs="a">
                Besøk
              </Button>
            )}
            {urlgithub && urlgithub.length > 0 && (
              <Button href={urlgithub[0].url} renderAs="a">
                GitHub
              </Button>
            )}
          </div>
        </div>
      </BounceInScroll>
    </div>
  );
};
export default ProsjektCard;
