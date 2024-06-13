import ReactMatrixAnimation from "@/components/Animations/Matrix.component";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="absolute w-full h-full">
      <ReactMatrixAnimation />
      <div className="absolute inset-0 flex flex-col items-center justify-center h-full">
        <h1 className="text-white text-5xl m-4">You are lost, Neo</h1>
        <Link
          href="/"
          className="glitch text-white m-4 text-xl p-6 mt-4 bg-blue-500 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          data-text="Return to the Matrix"
        >
          Return to the Matrix
        </Link>
      </div>
    </div>
  );
}
