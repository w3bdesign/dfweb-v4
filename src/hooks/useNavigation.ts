import { usePathname } from "next/navigation";

interface NavigationLink {
  title: string;
  name: string;
  hash: string;
  href: string;
  externalLink: boolean;
}

/**
 * Custom hook for managing navigation state and logic
 * @param {NavigationLink[]} navigationLinks - Array of navigation links
 * @returns {Object} An object containing navigation-related data and functions
 * @property {NavigationLink[]} navigationLinks - The array of navigation links passed to the hook
 * @property {function} isLinkActive - A function that checks if a given link is currently active
 */
export function useNavigation(navigationLinks: NavigationLink[]) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => pathname === href;

  return {
    navigationLinks,
    isLinkActive,
  };
}
