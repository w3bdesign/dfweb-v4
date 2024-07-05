import React from "react";

interface PillProps {
  text: string;
  className?: string;
  href?: string;
  onClick?: () => void;
}

/**
 * Renders a Pill component.
 *
 * @param {PillProps} props - The properties for the Pill component.
 * @param {string} props.text - The text to display in the Pill.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the Pill.
 * @param {string} [props.href] - The URL to navigate to when the Pill is clicked.
 * @param {() => void} [props.onClick] - The function to call when the Pill is clicked.
 * @return {JSX.Element} The rendered Pill component.
 */
const Pill: React.FC<PillProps> = ({ text, className = "", href, onClick }) => {
  const baseClasses = `glitch text-white m-4 text-xl p-6 mt-4 rounded-full transition duration-300 ease-in-out transform
                 bg-blue-600 bg-opacity-20 border-2 border-blue-800 border-opacity-30                     
                 hover:bg-blue-400 hover:bg-opacity-30
                 hover:shadow-[0_0_15px_rgba(0,255,255,0.1),0_0_20px_rgba(0,255,255,0.1),inset_0_0_20px_rgba(0,255,255,0.1)]
                 backdrop-blur-sm ${className}`;

  if (href) {
    return (
      <a href={href} className={baseClasses} data-text={text}>
        {text}
      </a>
    );
  }

  return (
    <button className={baseClasses} onClick={onClick} data-text={text}>
      {text}
    </button>
  );
};

export default Pill;
