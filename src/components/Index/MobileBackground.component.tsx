import Image from "next/image";

/**
 * MobileBackground component that renders a background image for mobile devices using next/image
 * @returns {JSX.Element} The rendered MobileBackground component
 */
const MobileBackground = () => (
  <div className="absolute inset-0 md:hidden -top-2 -mb-2">
    <Image
      priority
      fill
      src="/images/mobilbg.webp"
      alt="Background image"
      className="object-cover object-center"
    />
  </div>
);

export default MobileBackground;
