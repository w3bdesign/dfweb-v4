import React from "react";

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
      <img
        src={projectimage}
        alt={name}
        className="w-full h-48 object-cover p-4"
      />
      <div className="p-4">
        <h1 className="text-xl text-center font-bold py-2">{name}</h1>
        <h2 className="text-md text-gray-600">{description}</h2>
        <p className="text-sm text-gray-500">{subdescription}</p>
        <div className="flex justify-between mt-4">
          {urlwww && urlwww.length > 0 && (
            <a
              href={urlwww[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Website
            </a>
          )}
          {urlgithub && urlgithub.length > 0 && (
            <a
              href={urlgithub[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProsjektCard;
