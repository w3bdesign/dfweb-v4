"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/UI/Button.component";
import styles from "./ProsjektCard.module.css";
import { urlFor } from "@/lib/sanity/helpers";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };

  return (
    <div
      className={`${styles.tile} ${isHovered && !isMobile ? styles.hovered : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      aria-label={`Project: ${name}`}
    >
      <div className={styles.imageContainer}>
        <Image
          className={styles.image}          
          width="800"
          height="650"
          quality={100}
          src={urlFor(projectimage).url() as string}
          alt={name}
          priority
         
        />
      </div>
      <div className={styles.details}>
        <div
          className={`${styles.textBackground} ${isMobile ? styles.mobileTextBackground : ""}`}
        >
          <span className={styles.title}>{name}</span>
          <span className={styles.info}>{description}</span>
          <span className={styles.info}>{subdescription}</span>
        </div>
        <div
          className={`${styles.buttons} ${isMobile ? styles.mobileButtons : ""}`}
        >
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
