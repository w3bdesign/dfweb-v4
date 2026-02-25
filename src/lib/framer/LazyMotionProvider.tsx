"use client";

import { LazyMotion, domAnimation } from "motion/react";
import { ReactNode } from "react";

interface LazyMotionProviderProps {
  children: ReactNode;
}

const LazyMotionProvider = ({ children }: LazyMotionProviderProps) => {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
};

export default LazyMotionProvider;
