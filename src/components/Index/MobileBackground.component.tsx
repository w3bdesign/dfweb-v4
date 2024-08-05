const MobileBackground = () => (
  <div
    className="absolute inset-0 md:hidden bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('/images/mobilbg.webp')",
      top: "-0.5rem",
      marginBottom: "2.5rem",
    }}
  />
);

export default MobileBackground;
