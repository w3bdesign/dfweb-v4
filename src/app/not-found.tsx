import ReactMatrixAnimation from "@/components/Animations/Matrix.component";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="absolute w-full h-full">
      <ReactMatrixAnimation />
      <div className="absolute inset-0 flex flex-col items-center justify-center h-full">
        <h1 className="text-white text-5xl m-6">Har du gått deg vill, Neo?</h1>
        <Link
          href="/"
          className="glitch text-white m-4 text-xl p-6 mt-4 rounded-full transition duration-300 ease-in-out transform
                     bg-blue-600 bg-opacity-30 border-2 border-blue-800 border-opacity-30                     
                     hover:bg-blue-400 hover:bg-opacity-30
                     hover:shadow-[0_0_15px_rgba(0,255,255,0.1),0_0_20px_rgba(0,255,255,0.1),inset_0_0_20px_rgba(0,255,255,0.1)]
                     backdrop-blur-sm"
          data-text="Returner til Matrix"
        >
          Returner til Matrix
        </Link>
      </div>
    </div>
  );
}
