import type { ReactNode } from "react";

export interface IPageHeaderProps {
  children: ReactNode;
}

/**
 * PageHeader component for rendering the header for each page
 * @function PageHeader
 * @param {children?} children - HTML children to render in the page header component
 * @returns {ReactNode} - Rendered component
 */

const PageHeader = ({ children }: IPageHeaderProps) => (
  <div className="px-4 lg:px-0 xl:px-0 md:px-0">
    <div className="container bg-slate-800/80 border border-matrix-dark/30 shadow-glow-sm rounded-sm h-16 p-4 m-4 mx-auto backdrop-blur-sm">
      <h1 className="text-2xl text-center font-bold text-matrix-light tracking-wider">
        <span className="text-matrix-dark/60 mr-2" aria-hidden="true">
          &gt;
        </span>
        {children}
        <span
          className="inline-block w-2 h-5 bg-matrix-light/80 ml-1 align-middle animate-[pulse_1s_ease-in-out_infinite]"
          aria-hidden="true"
        />
      </h1>
    </div>
  </div>
);

export default PageHeader;
