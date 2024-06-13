import Image from "next/image";
import Link from "next/link";

import PageHeader from "@/components/UI/PageHeader.component";

/**
 * Renders CV content
 * @function CVContent
 * @returns {JSX.Element} - Rendered component
 */

const CVContent = () => (
  <main id="maincontent">
    <div className="mt-32 bg-graybg">
      <PageHeader>CV</PageHeader>
      <div className="px-4 lg:px-0 xl:px-0 md:px-0">
        <div className="container mx-auto bg-white rounded shadow sm:mb-4">
          <div className="p-4 mx-auto h-96 md:h-full mt-4 flex justify-center items-center">
            <div className="p-4 text-lg rounded">
              <div className="mt-4 flex flex-col items-center md:block">
                <div className="flex justify-center hidden md:block">
                  <img
                    src="/cv/page_1.webp"
                    alt="CV"
                    className="w-2/3 mx-auto"
                  />
                </div>
                <br />
                <div className="flex justify-center hidden md:block">
                  <img
                    src="/cv/page_2.webp"
                    alt="CV"
                    className="w-2/3 mx-auto"
                  />
                </div>
              </div>
              <div className="mx-auto pt-2 text-center sm:mt-2 xs:mt-2 bg-gray-800 rounded w-64 h-12 text-white cursor-pointer">
                <Link href="./cv.pdf">Last ned PDF</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);

export default CVContent;
