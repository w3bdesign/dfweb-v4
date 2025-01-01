/**
 * MobileBackground component that renders a background image for mobile devices
 * @returns {JSX.Element} The rendered MobileBackground component
 */
const MobileBackground = () => (
  <div
    className="absolute inset-0 md:hidden bg-cover bg-center bg-no-repeat py-[5rem]"
    style={{
      backgroundImage: "url('/images/mobilbg.webp')",
      top: "-0.5rem",
      marginBottom: "0.5rem",
    }}
  />
);

export default MobileBackground;
