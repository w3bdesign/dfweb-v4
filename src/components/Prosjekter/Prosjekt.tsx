import React from "react";
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

const Prosjekt: React.FC<ProjectProps> = ({
  name,
  description,
  subdescription,
  projectimage,
  urlwww,
  urlgithub,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden relative group">
      <div className="relative w-full h-48 md:h-60">
        <img
          src={projectimage}
          alt={name}
          className="p-4 object-cover w-full h-full"
        />
      </div>
      <div className="p-2 flex flex-col justify-between min-h-[250px] xl:min-h-[300px]">
        <div>
          <h1 className="xl:mt-4 text-xl text-center font-bold py-2">{name}</h1>
          <h2 className="text-md text-gray-600">{description}</h2>
          <p className="mt-4 text-sm text-gray-500 mt-2">{subdescription}</p>
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
      <div className="p-8 absolute inset-0 bg-opacity-80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 overlay bg-[url('/images/matrix.jpg')]">
        <div className="p-2 flex flex-col justify-between min-h-[250px] xl:min-h-[300px]">
          <h1 className="xl:mt-4 text-xl text-center font-bold py-2 text-white">{name}</h1>
          <h2 className="text-md text-white">{description}</h2>
          <p className="mt-4 text-sm text-white mt-2">{subdescription}</p>
        </div>
      </div>
    </div>
  );
};

export default Prosjekt;
