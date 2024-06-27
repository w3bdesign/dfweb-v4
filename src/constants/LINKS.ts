interface ILinks {
  title: string;
  name: string;
  hash: string;
  href: string;
  externalLink: boolean;
}

export const LINKS: ILinks[] = [
  {
    title: "Home",
    name: "Hjem",
    hash: "#hjem",
    href: "/",
    externalLink: false,
  },
  {
    title: "Prosjekter",
    name: "Prosjekter",
    hash: "#prosjekter",
    href: "/prosjekter",
    externalLink: false,
  },
  {
    title: "CV",
    name: "CV",
    hash: "#cv",
    href: "/cv",
    externalLink: false,
  },
  {
    title: "Github",
    name: "Github",
    hash: "#github",
    href: "https://github.com/w3bdesign",
    externalLink: true,
  },
  {
    title: "Kontakt",
    name: "Kontakt",
    hash: "#kontakt",
    href: "/kontakt",
    externalLink: false,
  },
];
