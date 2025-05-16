// Mock implementation of the Sanity client
export const client = {
  fetch: jest.fn().mockResolvedValue([]),
};

export function urlFor() {
  // Create a chainable API with methods that return the same object
  const imageUrlBuilder = {
    width: () => imageUrlBuilder,
    height: () => imageUrlBuilder,
    fit: () => imageUrlBuilder,
    quality: () => imageUrlBuilder,
    auto: () => imageUrlBuilder,
    url: () => "/mocked-image-url",
  };

  return imageUrlBuilder;
}
