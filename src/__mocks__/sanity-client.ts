// Mock implementation of the Sanity client
export const client = {
  fetch: jest.fn().mockResolvedValue([]),
};

export function urlFor() {
  return {
    width: () => ({
      height: () => ({
        fit: () => ({
          quality: () => ({
            auto: () => ({
              url: () => "/mocked-image-url",
            }),
          }),
        }),
      }),
    }),
  };
}
