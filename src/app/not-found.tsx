import ReactMatrixAnimation from "@/components/Animations/Matrix.component";
import Pill from "@/components/UI/Pill.component";

export default function Custom404() {
  return (
    <main className="absolute w-full h-full">
      <ReactMatrixAnimation />
      <div className="absolute inset-0 flex flex-col items-center justify-center h-full">
        <p className="text-white text-7xl font-bold mb-2">404</p>
        <h1 className="text-white text-5xl m-6">Har du gått deg vill, Neo?</h1>
        <p className="text-white text-xl mb-6">Siden ble ikke funnet</p>
        <Pill href="/" text="Returner til Matrix" />
      </div>
    </main>
  );
}
