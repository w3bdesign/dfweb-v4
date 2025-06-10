import React from "react";
import { Meta } from "@ladle/react";
import IndexContent from "@/components/Index/IndexContent.component";
import type { Pagecontent } from "@/types/sanity.types";

import "@/app/globals.css";

export default {
  title: "Index/IndexContent",
  component: IndexContent,
} as Meta;

const mockPageContentSingle: Pagecontent[] = [
  {
    _type: "pagecontent",
    id: 1,
    title: "Velkommen til min portefølje",
    text: [
      {
        _key: "block1",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "span1",
            _type: "span",
            text: "Dette er en introduksjon til porteføljen. Her finner du informasjon om mine prosjekter, ferdigheter og erfaringer. ",
          },
          {
            _key: "span2",
            _type: "span",
            text: "Utforsk gjerne sidene for å lære mer om meg.",
            marks: ["strong"],
          },
        ],
      },
      {
        _key: "block2",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "span1",
            _type: "span",
            text: "Jeg har jobbet med en rekke teknologier, inkludert React, Next.js, TypeScript, og Sanity.",
          },
        ],
      },
    ],
  },
];

const mockPageContentMultiple: Pagecontent[] = [
  {
    _type: "pagecontent",
    id: 1,
    title: "Om Meg",
    text: [
      {
        _key: "block1",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "span1",
            _type: "span",
            text: "Jeg er en engasjert frontend-utvikler med lidenskap for å skape intuitive og brukervennlige nettopplevelser. Med solid erfaring innen moderne webteknologier, trives jeg med å løse komplekse problemer og levere kode av høy kvalitet.",
          },
        ],
      },
    ],
  },
  {
    _type: "pagecontent",
    id: 2,
    title: "Mine Ferdigheter",
    text: [
      {
        _key: "block1",
        _type: "block",
        style: "h3",
        children: [{ _key: "span1", _type: "span", text: "Frontend" }],
      },
      {
        _key: "block2",
        _type: "block",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _key: "span1",
            _type: "span",
            text: "React, Next.js, TypeScript, JavaScript (ES6+)",
          },
        ],
      },
      {
        _key: "block3",
        _type: "block",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _key: "span1",
            _type: "span",
            text: "HTML5, CSS3, Tailwind CSS, Styled Components",
          },
        ],
      },
      {
        _key: "block4",
        _type: "block",
        style: "h3",
        children: [{ _key: "span1", _type: "span", text: "Backend & CMS" }],
      },
      {
        _key: "block5",
        _type: "block",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _key: "span1",
            _type: "span",
            text: "Sanity.io, Node.js (grunnleggende)",
          },
        ],
      },
    ],
  },
  {
    _type: "pagecontent",
    id: 3,
    title: "Prosjekterfaring",
    text: [
      {
        _key: "block1",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "span1",
            _type: "span",
            text: "Jeg har jobbet på diverse prosjekter, fra små nettsider til større applikasjoner. Se 'Prosjekter'-siden for detaljer.",
          },
        ],
      },
    ],
  },
];

const mockPageContentMany: Pagecontent[] = [
  ...mockPageContentMultiple,
  {
    _type: "pagecontent",
    id: 4,
    title: "Interesser",
    text: [
      {
        _key: "block1",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "span1",
            _type: "span",
            text: "Utenom koding liker jeg å holde meg oppdatert på nye teknologier, bidra til open source-prosjekter, og gå turer i naturen.",
          },
        ],
      },
    ],
  },
  {
    _type: "pagecontent",
    id: 5,
    title: "Kontaktinformasjon",
    text: [
      {
        _key: "block1",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "span1",
            _type: "span",
            text: "Ta gjerne kontakt via kontaktskjemaet eller finn meg på LinkedIn.",
          },
        ],
      },
    ],
  },
];

export const Default = () => (
  <div className="bg-gray-900">
    <IndexContent pageContent={mockPageContentMultiple} />
  </div>
);

export const SingleSection = () => (
  <div className="bg-gray-900">
    <IndexContent pageContent={mockPageContentSingle} />
  </div>
);

export const ManySections = () => (
  <div className="bg-gray-900">
    <IndexContent pageContent={mockPageContentMany} />
  </div>
);

export const AlternatingVariants = () => (
  <div className="bg-gray-900">
    <IndexContent pageContent={mockPageContentMany} />
    <div className="p-4 mt-8 bg-slate-700 text-white text-center">
      <p>Observer hvordan bakgrunnsfargen på seksjonene alternerer.</p>
    </div>
  </div>
);
