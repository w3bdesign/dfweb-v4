import { IconType } from "react-icons";
import { FaReact, FaVuejs, FaPhp } from "react-icons/fa";
import { SiTypescript, SiWordpress } from "react-icons/si";

import Grow from "../Animations/Grow.component";

interface IAnimateIcons {
  id: number;
  Icon: IconType;
  iconName: string;
}

const AnimateIcons: IAnimateIcons[] = [
  {
    id: 0,
    Icon: FaReact,
    iconName: "React",
  },
  {
    id: 1,
    Icon: FaVuejs,
    iconName: "VueJS",
  },
  {
    id: 2,
    Icon: SiTypescript,
    iconName: "TypeScript",
  },
  {
    id: 3,
    Icon: SiWordpress,
    iconName: "WordPress",
  },
  {
    id: 4,
    Icon: FaPhp,
    iconName: "PHP",
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
    className="flex justify-center mt-4 p-2 text-slate-300/[0.8] mb-8 md:mb-0"
  >
    {AnimateIcons.map(({ Icon, id, iconName }) => (
      <span className="p-2" key={id}>
        <Grow delay={1.8 + id * 0.2}>
          <div className="relative group">
            <Icon
              data-testid={iconName}
              aria-label={`${iconName} ikon`}
              title={`${iconName} ikon`}
              size="3em"
              className="transition-transform duration-300 hover:-translate-y-1 hover:text-white"
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
