import PageHeader from "@/components/UI/PageHeader.component";
import Button from "@/components/UI/Button.component";
import Tabs from "@/components/UI/Tabs.component";

interface CVData {
  keyQualifications: string[];
  experience: Array<{
    period: string;
    company: string;
    role: string;
    description: string;
  }>;
  education: Array<{
    period: string;
    institution: string;
    degree: string;
    description: string;
  }>;
  volunteerWork: Array<{
    period: string;
    organization: string;
    role: string;
    description: string;
  }>;
}

interface CVContentProps {
  cvData: CVData;
}

/**
 * CVContent component for rendering the CV page with tabs
 * @param {CVContentProps} props - The props for the CVContent component
 * @returns {JSX.Element} The rendered CVContent component
 */
const CVContent: React.FC<CVContentProps> = ({ cvData }) => {
  const tabs = [
    {
      id: "qualifications",
      label: "Nøkkelkvalifikasjoner",
      content: (
        <ul className="list-disc pl-5 text-slate-300/[0.9]">
          {cvData.keyQualifications.map((qual) => (
            <li key={qual} className="mb-2">
              {qual}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "experience",
      label: "Erfaring",
      content: (
        <div className="text-slate-300/[0.9]">
          {cvData.experience.map((exp) => (
            <div key={exp.description} className="mb-6">
              <h3 className="font-semibold text-slate-100">
                {exp.period} - {exp.company}
              </h3>
              {exp.role && <p className="italic">{exp.role}</p>}
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "education",
      label: "Utdanning",
      content: (
        <div className="text-slate-300/[0.9]">
          {cvData.education.map((edu) => (
            <div key={edu.description} className="mb-6">
              <h3 className="font-semibold text-slate-100">
                {edu.period} - {edu.institution}
              </h3>
              {edu.degree && <p className="italic">{edu.degree}</p>}
              <p>{edu.description}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "volunteerWork",
      label: "Frivillig arbeid",
      content: (
        <div className="text-slate-300/[0.9]">
          {cvData.volunteerWork?.map((vol) => (
            <div key={vol.description} className="mb-6">
              <h3 className="font-semibold text-slate-100">
                {vol.period} - {vol.organization}
              </h3>
              {vol.role && <p className="italic">{vol.role}</p>}
              <p>{vol.description}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <main id="maincontent">
      <div className="mt-32 bg-graybg">
        <PageHeader>CV</PageHeader>
        <div className="px-4 lg:px-0 xl:px-0 md:px-0">
          <div className="container mx-auto bg-slate-700 rounded shadow sm:mb-4">
            <div className="p-4 mx-auto md:h-full mt-4 flex flex-col justify-center items-center md:min-h-[600px] min-h-[400px]">
              <div className="p-4 text-lg rounded md:w-full">
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
