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
    className="flex flex-wrap justify-center gap-8 p-2 text-slate-300/[0.8]"
  >
    {AnimateIcons.map(({ Icon, id, iconName }) => (
      <span className="relative" key={id}>
        <Grow delay={1.8 + id * 0.2}>
          <div className="relative group">
            <div className="p-4 rounded-lg bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 transition-all duration-300 group-hover:border-[#00ff62]/30 group-hover:bg-slate-900/70">
              <Icon
                data-testid={iconName}
                aria-label={`${iconName} ikon`}
                title={`${iconName} ikon`}
                size="2.5em"
                className="transition-all duration-300 group-hover:text-[#00ff62]"
              />
            </div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-[#00ff62]">
              {iconName}
            </span>
          </div>
        </Grow>
      </span>
    ))}
  </div>
);

export default Icons;
