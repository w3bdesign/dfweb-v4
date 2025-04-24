/**
 * MobileBackground component that renders a background gradient for mobile devices.
 * @returns {JSX.Element} The rendered MobileBackground component
 */
const MobileBackground = () => (
  <div className="absolute inset-0 -top-2 -mb-2 bg-gradient-to-b from-[#000000] to-emerald-800 md:hidden" />
);

export default MobileBackground;
