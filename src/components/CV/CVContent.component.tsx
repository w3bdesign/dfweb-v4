import PageHeader from "@/components/UI/PageHeader.component";
import Button from "@/components/UI/Button.component";
import Tabs from "@/components/UI/Tabs.component";

import QualificationsTabContent from "./QualificationsTabContent";
import ExperienceTabContent from "./ExperienceTabContent";
import EducationTabContent from "./EducationTabContent";
import VolunteerWorkTabContent from "./VolunteerWorkTabContent";

import type { Cv } from "@/types/sanity.types";

/**
 * CVContent component for rendering the CV page with tabs
 * @param {Object} props - The props for the CVContent component
 * @param {Cv} props.cvData - The CV data from Sanity
 * @returns {JSX.Element} The rendered CVContent component
 */
const CVContent = ({ cvData }: { cvData: Cv }) => {
  const tabs = [
    {
      id: "qualifications",
      label: "Nøkkelkvalifikasjoner",
      content: (
        <QualificationsTabContent qualifications={cvData.keyQualifications} />
      ),
    },
    {
      id: "experience",
      label: "Erfaring",
      content: <ExperienceTabContent experience={cvData.experience} />,
    },
    {
      id: "education",
      label: "Utdanning",
      content: <EducationTabContent education={cvData.education} />,
    },
    {
      id: "volunteerWork",
      label: "Frivillig arbeid",
      content: <VolunteerWorkTabContent volunteerWork={cvData.volunteerWork} />,
    },
  ];

  return (
    <main id="maincontent">
      <div className="mt-32 bg-graybg">
        <PageHeader>CV</PageHeader>
        <div className="px-4 lg:px-0 xl:px-0 md:px-0">
          <div className="container mx-auto bg-slate-700 rounded-sm shadow-sm sm:mb-4">
            <div className="p-4 mx-auto md:h-full mt-4 flex flex-col justify-center items-center md:min-h-[600px] min-h-[400px]">
              <div className="p-4 text-lg rounded-sm md:w-full">
                <div className="md:flex md:justify-center hidden">
                  <Tabs tabs={tabs} />
                </div>
                <div className="mx-auto text-center md:mt-8 md:hidden">
                  <Button href="./cv2.pdf" renderAs="a" type="button">
                    Last ned PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CVContent;
