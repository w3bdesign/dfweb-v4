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

  const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const triplet = (e1: number, e2: number, e3: number) =>
    keyStr.charAt(e1 >> 2) +
    keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
    keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
    keyStr.charAt(e3 & 63);
  const rgbDataURL = (r: number, g: number, b: number) =>
    `data:image/gif;base64,R0lGODlhAQABAPAA${
      triplet(0, r, g) + triplet(b, 255, 255)
    }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative w-full h-48 md:h-60">
        <Image
          src={projectimage}
          alt={name}
          className="p-4 object-cover w-full h-full"
          quality={80}
          placeholder="blur"
          blurDataURL={rgbDataURL(255, 255, 255)}
          fill
        />
      </div>
      <div className="p-2 flex flex-col justify-between min-h-[250px] xl:min-h-[320px]">
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
    </div>
  );
};

export default ProsjektCard;
