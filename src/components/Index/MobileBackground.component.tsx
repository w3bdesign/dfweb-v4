/**
 * MobileBackground component that renders a background image for mobile devices
 * @returns {JSX.Element} The rendered MobileBackground component
 */
const MobileBackground = () => (
  <div
    className="absolute inset-0 md:hidden bg-cover bg-center bg-no-repeat h-[10rem]"
    style={{
      backgroundImage: "url('/images/mobilbg.webp')",
      top: "0.2rem",
      marginBottom: "0.2rem",
      height: "500px"
    }}
  />
);

export default MobileBackground;
