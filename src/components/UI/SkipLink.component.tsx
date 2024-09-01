import React from 'react';

const SkipLink: React.FC = () => {
  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-white focus:text-black focus:p-4"
    >
      Hopp til hovedinnhold
    </a>
  );
};

export default SkipLink;