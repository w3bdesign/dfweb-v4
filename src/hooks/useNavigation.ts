import { usePathname } from "next/navigation";

interface NavigationLink {
  title: string;
  name: string;
  hash: string;
  href: string;
  externalLink: boolean;
}

export function useNavigation(navigationLinks: NavigationLink[]) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => pathname === href;

  return {
    navigationLinks,
    isLinkActive,
  };
}