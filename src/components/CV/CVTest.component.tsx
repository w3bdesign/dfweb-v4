"use client";

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
}

const cvData: CVData = {
  keyQualifications: [
    "Totalt over 10 års erfaring med utvikling og design av nettbutikker og nettsider, erfaring både med fullstack og frontend, men i nyere tid spesialisert på frontend.",
    "Erfaring med språk som Javascript (ES 6) og Typescript med rammeverk som React, Gatsby, Vue 2 og 3, Nuxt, Next, Node.js, Storybook, testing med Jest og Cypress samt design med Tailwind CSS, Bootstrap, Styled Components og mange andre relevante verktøy og rammeverk.",
  ],
  experience: [
    {
      period: "2007 – 2023",
      company: "Frilans",
      role: "",
      description:
        "Arbeid med utvikling og design av hjemmesider i PHP, mySQL, WordPress og JavaScript.",
    },
    {
      period: "2021 – 2021",
      company: "NovaCare",
      role: "Senior frontendutvikler",
      description:
        "Ansvar for utvikling av løsninger i Javascript med bruk av Vue 2 som rammeverk samt SCSS for styling. Har også brukt Storybook for dokumentasjon av komponenter.",
    },
    {
      period: "2016 – 2019",
      company: "M360 Media Group",
      role: "",
      description:
        "Utvikling og design av nettbutikker og nettsider (WordPress, WooCommerce og Magento). Supportansvarlig på Pckasse og nettbutikk. Utvikling av løsninger i PHP og Javascript med mer.",
    },
    {
      period: "2014 – 2015",
      company: "Qurius",
      role: "",
      description:
        "Utvikling, design og implementering av firmaets og kunders hjemmesider (Opencart og WordPress). Utvikling av løsninger i PHP og Javascript med mer.",
    },
    {
      period: "2010 – 2012",
      company: "Markedsmateriell",
      role: "",
      description:
        "Utvikling, design og implementering av hjemmesider i Joomla samt prosjektledelse. Arbeidet også med trykk og print, samt drift og support av nettverk og tilhørende løsninger. Utvikling av løsninger i PHP og Javascript med mer.",
    },
    {
      period: "2007 – 2008",
      company: "Experian",
      role: "",
      description:
        "Salg av kredittløsninger over telefon til bedriftsmarkedet.",
    },
    {
      period: "2007 – 2007",
      company: "EBGames",
      role: "",
      description: "Salg av spill og elektronikk i butikk.",
    },
    {
      period: "2000 – 2002",
      company: "Vianett",
      role: "",
      description:
        "Utvikling, design og implementering av hjemmesider i HTML og CSS, med hovedfokus på ASP.",
    },
  ],
  education: [
    {
      period: "2019 – 2023",
      institution: "Kompetanseheving / egenlæring frontendutvikling",
      degree: "",
      description:
        "Kompetanseheving og egenlæring i frontendutvikling primært med fokus på React, Vue, JavaScript og andre rammeverk og verktøy. Læringsprosessen er dokumentert via Github.",
    },
    {
      period: "2005 - 2006",
      institution: "Greåker VGS",
      degree: "Allmennfaglig påbygning",
      description: "Fordypning i matematikk.",
    },
    {
      period: "2002 - 2005",
      institution: "Malakoff VGS",
      degree: "GK, VK1 og VK2 Service-elektroniker",
      description: "Fordypning i data og kontormaskiner.",
    },
  ],
};

const CV: React.FC = () => {
  const tabs = [
    {
      id: "qualifications",
      label: "Nøkkelkvalifikasjoner",
      content: (
        <ul className="list-disc pl-5 text-gray-300">
          {cvData.keyQualifications.map((qual, id) => (
            <li key={id} className="mb-2">
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
        <div className="text-gray-300">
          {cvData.experience.map((exp, id) => (
            <div key={id} className="mb-6">
              <h3 className="font-semibold text-white">
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
        <div className="text-gray-300">
          {cvData.education.map((edu, id) => (
            <div key={id} className="mb-6">
              <h3 className="font-semibold text-white">
                {edu.period} - {edu.institution}
              </h3>
              {edu.degree && <p className="italic">{edu.degree}</p>}
              <p>{edu.description}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 text-white">
      <Tabs tabs={tabs} />
    </div>
  );
};

export default CV;
