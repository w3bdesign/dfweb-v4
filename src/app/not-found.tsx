import ReactMatrixAnimation from "@/components/Animations/Matrix.component";
import Pill from "@/components/UI/Pill.component";

export default function Custom404() {
  return (
    <div className="absolute w-full h-full">
      <ReactMatrixAnimation />
      <div className="absolute inset-0 flex flex-col items-center justify-center h-full">
        <h1 className="text-white text-5xl m-6">Har du gått deg vill, Neo?</h1>
        <Pill href="/" text="Returner til Matrix" />
      </div>
    </div>
  );
}
