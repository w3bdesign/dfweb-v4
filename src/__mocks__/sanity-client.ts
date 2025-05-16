export const client = {
  fetch: jest.fn().mockResolvedValue([]),
};

export function urlFor() {
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
