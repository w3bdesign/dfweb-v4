import PageHeader from "@/components/UI/PageHeader.component";
import RotatingLoader from "@/components/Animations/RotatingLoader.component";

export default function Loading() {
  return (
    <main aria-label="Laster portefølje" className="mt-32 bg-graybg">
      <PageHeader>Prosjekter</PageHeader>
      <div className="container mx-auto flex justify-center items-center min-h-[400px]">
        <RotatingLoader />
      </div>
    </main>
  );
}
