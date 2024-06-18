"use client";

import React, { useState } from "react";
import Button from "@/components/UI/Button.component";
import styles from "./Tiles.module.css";

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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`${styles.tile} ${isHovered ? styles.hovered : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      aria-label={`Project: ${name}`}
    >
      <img src={projectimage} alt={name} className={styles.image} />
      <div className={styles.details}>
        <span className={styles.title}>{name}</span>
        <span className={styles.info}>{description}</span>
        <span className={styles.info}>{subdescription}</span>
        {isHovered && (
          <div className={styles.buttons}>
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
        )}
      </div>
    </div>
  );
};

export default ProsjektCard;
