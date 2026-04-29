"use client";

import React from "react";
import Button from "@/components/UI/Button.component";
import BounceInScroll from "@/components/Animations/BounceInScroll.component";

import { urlFor } from "@/lib/sanity/client";

import type { Project } from "@/types/sanity.types";

interface ProsjektCardProps extends Project {
  /** Stagger delay in seconds for coordinated group animations */
  staggerDelay?: number;
}

/**
 * Renders a card displaying information about a single project.
 * Uses the Project type definition from Sanity types.
 *
 * @param {ProsjektCardProps} props - The project data object with optional stagger delay.
 * @param {string} props.name - The name of the project.
 * @param {string} [props.description] - A brief description of the project (optional).
 * @param {string} [props.subdescription] - Additional description of the project (optional).
 * @param {SanityImageObject} [props.projectimage] - The Sanity image object for the project (optional).
 * @param {Array<{url: string}>} [props.urlwww] - Array of website URL objects for the project (optional).
 * @param {Array<{url: string}>} [props.urlgithub] - Array of GitHub URL objects for the project (optional).
 * @param {number} [props.staggerDelay=0] - Stagger delay in seconds for coordinated group animations.
 * @returns {JSX.Element} The rendered ProsjektCard component.
 */

const ProsjektCard: React.FC<ProsjektCardProps> = ({
  name,
  description,
  subdescription,
  projectimage,
  urlwww,
  urlgithub,
  staggerDelay = 0,
}) => {
  return (
    <div
      className="bg-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 rounded-sm overflow-hidden mx-4 md:m-0 border border-matrix-dark/10 hover:border-matrix-dark/25"
      data-testid="project-card"
    >
      <BounceInScroll viewAmount={0.3} delay={staggerDelay}>
        <div className="relative w-full md:h-60">
          <div className="w-full h-full p-5 md:pb-[20px] relative overflow-hidden flex justify-center md:h-[340px]">
            {projectimage && (
              <img
                className="transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md hover:brightness-105"
                width={600}
                src={urlFor(projectimage)
                  .width(600)
                  .fit("max")
                  .quality(100)
                  .auto("format")
                  .url()}
                alt={`Skjermbilde av prosjektet ${name}`}
              />
            )}
          </div>
        </div>
        <div className="md:mt-[4.5rem] md:p-2 flex flex-col justify-between min-h-[250px] xl:min-h-[275px]">
          <h2 className="lg:mt-4 text-xl text-center font-bold py-2 text-slate-100">
            {name}
          </h2>
          <h3 className="text-base px-4 text-gray-300">{description}</h3>
          <p className="mt-4 text-sm mt-2 px-4 text-gray-300">
            {subdescription}
          </p>
          <div className="flex justify-center mt-4">
            {urlwww && urlwww.length > 0 && (
              <Button href={urlwww?.[0]?.url} renderAs="a">
                Besøk
              </Button>
            )}
            {urlgithub && urlgithub.length > 0 && (
              <Button href={urlgithub?.[0]?.url} renderAs="a">
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
