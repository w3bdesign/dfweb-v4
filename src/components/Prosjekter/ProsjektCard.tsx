import React from "react";
import Image from "next/image";
import Button from "@/components/UI/Button.component";

interface ProjectProps {
  id: string;
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
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative w-full h-48 md:h-60">
        <Image
          src={projectimage}
          alt={name}
          className="object-cover w-full h-full"
          fill
        />
      </div>
      <div className="p-2 flex flex-col justify-between min-h-[350px]">
        <div>
          <h1 className="mt-12 text-xl text-center font-bold py-2">{name}</h1>
          <h2 className="text-md text-gray-600">{description}</h2>
          <p className="mt-4 text-sm text-gray-500 mt-2">{subdescription}</p>
        </div>
        <div className="flex justify-center mt-4">
          {urlwww && urlwww.length > 0 && (
            <Button href={urlwww[0].url} renderAs="a">
              Website
            </Button>
          )}
          {urlgithub && urlgithub.length > 0 && (
            <Button href={urlgithub[0].url} renderAs="a">
              GitHub
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProsjektCard;
