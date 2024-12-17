import React, { useEffect, useState } from "react";
import { Meta } from "@ladle/react";

interface ReactMatrixAnimationProps {
  tileSize?: number;
  fadeFactor?: number;
  backgroundColor?: string;
  fontColor?: string;
  glowColor?: string;
  tileSet?: string[] | null;
}

export default {
  title: "Animations/Matrix",
} as Meta;

// Client-side only wrapper component
const ClientOnlyMatrix = (props: ReactMatrixAnimationProps) => {
  const [Matrix, setMatrix] =
    useState<React.ComponentType<ReactMatrixAnimationProps> | null>(null);

  useEffect(() => {
    import("../../components/Animations/Matrix.component").then((mod) => {
      setMatrix(() => mod.default);
    });
  }, []);

  if (!Matrix) {
    return <div>Loading Matrix...</div>;
  }

  return <Matrix {...props} />;
};

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-full h-[400px] bg-gray-900">{children}</div>
);

// Basic story with default props
export const Default = () => (
  <Container>
    <ClientOnlyMatrix />
  </Container>
);

// Story with custom colors
export const CustomColors = () => (
  <Container>
    <ClientOnlyMatrix
      backgroundColor="#000000"
      fontColor="#FF0000"
      glowColor="#FF4444"
    />
  </Container>
);

// Story with larger tiles
export const LargeTiles = () => (
  <Container>
    <ClientOnlyMatrix
      tileSize={30}
      backgroundColor="#000000"
      fontColor="#00FF00"
      glowColor="#00FF00"
    />
  </Container>
);

// Story with smaller tiles
export const SmallTiles = () => (
  <Container>
    <ClientOnlyMatrix
      tileSize={12}
      backgroundColor="#000000"
      fontColor="#00FF00"
      glowColor="#00FF00"
    />
  </Container>
);

// Story with binary characters
export const BinaryMatrix = () => (
  <Container>
    <ClientOnlyMatrix
      tileSet={["0", "1"]}
      backgroundColor="#000000"
      fontColor="#00FF00"
      glowColor="#00FF00"
    />
  </Container>
);

// Story with slow fade effect
export const SlowFade = () => (
  <Container>
    <ClientOnlyMatrix
      fadeFactor={0.1}
      backgroundColor="#000000"
      fontColor="#00FF00"
      glowColor="#00FF00"
    />
  </Container>
);

// Story with blue theme
export const BlueTheme = () => (
  <Container>
    <ClientOnlyMatrix
      backgroundColor="#000033"
      fontColor="#0088FF"
      glowColor="#00AAFF"
      tileSet={["@", "#", "$", "%", "&", "*"]}
    />
  </Container>
);

// Story with purple theme
export const PurpleTheme = () => (
  <Container>
    <ClientOnlyMatrix
      backgroundColor="#1a0033"
      fontColor="#9933ff"
      glowColor="#bf80ff"
      tileSize={25}
      fadeFactor={0.3}
    />
  </Container>
);
