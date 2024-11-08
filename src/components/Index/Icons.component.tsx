import { IconType } from "react-icons";
import { FaReact, FaVuejs, FaPhp } from "react-icons/fa";
import { SiTypescript, SiWordpress } from "react-icons/si";

import Grow from "../Animations/Grow.component";

interface IAnimateIcons {
  id: number;
  Icon: IconType;
  iconName: string;
  color: string;
}

const AnimateIcons: IAnimateIcons[] = [
  { 
    id: 0, 
    Icon: FaReact, 
    iconName: "React",
    color: "#61DAFB"
  },
  { 
    id: 1, 
    Icon: FaVuejs, 
    iconName: "VueJS",
    color: "#4FC08D"
  },
  { 
    id: 2, 
    Icon: SiTypescript, 
    iconName: "TypeScript",
    color: "#3178C6"
  },
  { 
    id: 3, 
    Icon: SiWordpress, 
    iconName: "WordPress",
    color: "#21759B"
  },
  { 
    id: 4, 
    Icon: FaPhp, 
    iconName: "PHP",
    color: "#777BB4"
  },
];

/**
 * Icons component that renders SVG icons used on the front page
 * Uses Framer Motion for animations to show the SVGs
 * @returns {JSX.Element} The rendered Icons component
 */
const Icons = () => (
  <div
    data-testid="icons"
    className="flex justify-center mt-4 p-2 text-slate-300"
  >
    {AnimateIcons.map(({ Icon, id, iconName, color }) => (
      <span className="p-2" key={id}>
        <Grow delay={1.8 + id * 0.2}>
          <div className="relative group">
            <Icon
              data-testid={iconName}
              aria-label={`${iconName} ikon`}
              title={`${iconName} ikon`}
              size="3em"
              className="transition-transform duration-300 hover:-translate-y-1 hover:text-[#00ff62]"
              style={{ color }}
            />
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {iconName}
            </span>
          </div>
        </Grow>
      </span>
    ))}
  </div>
);

export default Icons;
