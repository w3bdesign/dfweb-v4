import React from "react";
import Image from "next/image";

import Button from "@/components/UI/Button.component";
import { urlFor } from "@/lib/sanity/helpers";
import BounceInScroll from "../Animations/BounceInScroll.component";

interface ProjectProps {
  name: string;
  description: string;
  subdescription: string;
  projectimage: string;
  urlwww: Array<{ url: string; _key: string }>;
  urlgithub: Array<{ url: string; _key: string }>;
}

const ProsjektCard: React.FC<ProjectProps> = ({
  name,
  description,
  subdescription,
  projectimage,
  urlwww,
  urlgithub,
}) => {
  return (
    <div className="bg-slate-700 shadow-md rounded-lg overflow-hidden mx-4 md:m-0">
      <BounceInScroll viewAmount={0.3}>
        <div className="relative w-full h-48 md:h-60">
          <div className="w-full h-full p-5 md:pb-[50px] relative overflow-hidden flex justify-center md:w-[750px] md:h-[350px]">
            {projectimage && (
              <Image
                className="flex justify-center text-center"
                width="600"
                height="350"
                quality={100}
                src={urlFor(projectimage).url() as string}
                alt={name}
                priority
                unoptimized
              />
            )}
          </div>
        </div>
        <div className="md:mt-12 p-2 flex flex-col justify-between min-h-[250px] xl:min-h-[275px]">
          <div>
            <h1 className="xl:mt-4 text-xl text-center font-bold py-2 text-slate-200">
              {name}
            </h1>
            <h2 className="text-md">{description}</h2>
            <p className="mt-4 text-sm mt-2">{subdescription}</p>
          </div>
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
