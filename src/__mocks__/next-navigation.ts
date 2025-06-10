/**
 * Mock for next/navigation module for use in Ladle stories
 */

let currentPathname = "/";

export const usePathname = () => currentPathname;

// Helper function to change the mock pathname for stories
export const setMockPathname = (path: string) => {
  currentPathname = path;
  return currentPathname;
};

export const useRouter = () => ({
  push: (path: string) => {
    currentPathname = path;
  },
  back: () => {},
  forward: () => {},
});

export const useSearchParams = () => {
  return {
    get: () => null,
    getAll: () => [],
    has: () => false,
    forEach: () => {},
    entries: () => [],
    keys: () => [],
    values: () => [],
  };
};
