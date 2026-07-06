import { ReactNode } from "react";

export interface IAnimateProps {
  children: ReactNode;
  cssClass?: string;
}

export interface IAnimateBounceProps {
  children: ReactNode;
  cssClass?: string;
  viewAmount?: "some" | "all" | number;
  instant?: boolean;
  delay?: number;
}

export interface IGrowProps {
  duration?: number;
  delay?: number;
  easing?: [number, number, number, number];
  children: ReactNode;
}
