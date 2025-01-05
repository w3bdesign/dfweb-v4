import { getProjects } from "@/app/prosjekter/actions";
import { client } from "@/lib/sanity/client";
import { projectsQuery } from "@/lib/sanity/queries";

// Mock the Sanity client
jest.mock("@/lib/sanity/client", () => ({
  client: {
    fetch: jest.fn(),
  },
}));

describe("getProjects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches projects successfully", async () => {
    // Arrange
    const mockProjects = [
      {
        id: "1",
        name: "Test Project",
        description: "Test Description",
        subdescription: "Test Subdescription",
        projectimage: { asset: { _ref: "test" } },
        urlwww: [],
        urlgithub: [],
      },
    ];
    const expectedFetchOptions = {
      next: { revalidate: 3600 },
    };
    (client.fetch as jest.Mock).mockResolvedValueOnce(mockProjects);
    
    // Act
    const result = await getProjects();
    
    // Assert
    expect(result).toEqual(mockProjects);
    expect(client.fetch).toHaveBeenCalledWith(
      projectsQuery,
      {},
      expectedFetchOptions
    );
  });

  it("handles fetch error correctly", async () => {
    // Arrange
    const expectedError = new Error("Fetch failed");
    (client.fetch as jest.Mock).mockRejectedValueOnce(expectedError);
    
    // Act & Assert
    await expect(getProjects()).rejects.toThrow("Failed to fetch projects");
  });
});
