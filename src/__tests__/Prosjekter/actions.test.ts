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
      expectedFetchOptions,
    );
  });

  describe("error handling", () => {
    it("handles authentication errors (401)", async () => {
      // Arrange
      const authError = {
        statusCode: 401,
        message: "Invalid token",
        details: { type: "credentials", description: "Invalid token provided" }
      };
      (client.fetch as jest.Mock).mockRejectedValueOnce(authError);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow("Authentication failed");
    });

    it("handles permission errors (403)", async () => {
      // Arrange
      const permError = {
        statusCode: 403,
        message: "Insufficient permissions",
        details: { type: "authorization", description: "Missing read access" }
      };
      (client.fetch as jest.Mock).mockRejectedValueOnce(permError);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow("Insufficient permissions");
    });

    it("handles rate limiting (429)", async () => {
      // Arrange
      const rateError = {
        statusCode: 429,
        message: "Too Many Requests",
        details: { type: "rate_limit", description: "Rate limit exceeded" }
      };
      (client.fetch as jest.Mock).mockRejectedValueOnce(rateError);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow("Rate limit exceeded");
    });

    it("handles malformed GROQ queries (400)", async () => {
      // Arrange
      const queryError = {
        statusCode: 400,
        message: "Invalid GROQ query",
        details: { type: "query_error", description: "Syntax error in GROQ query" }
      };
      (client.fetch as jest.Mock).mockRejectedValueOnce(queryError);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow("Sanity API error: Invalid GROQ query");
    });

    it("handles network timeouts", async () => {
      // Arrange
      const timeoutError = new Error("Network timeout");
      timeoutError.name = "TimeoutError";
      (client.fetch as jest.Mock).mockRejectedValueOnce(timeoutError);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow("Request timed out");
    });

    it("handles generic fetch errors", async () => {
      // Arrange
      const expectedError = new Error("Fetch failed");
      (client.fetch as jest.Mock).mockRejectedValueOnce(expectedError);

      // Act & Assert
      await expect(getProjects()).rejects.toThrow("Failed to fetch projects");
    });

    it("recovers after temporary errors", async () => {
      // Arrange
      const rateError = {
        statusCode: 429,
        message: "Too Many Requests",
        details: { type: "rate_limit", description: "Rate limit exceeded" }
      };
      const mockProjects = [{
        id: "1",
        name: "Test Project",
        description: "Test Description",
        subdescription: "Test Subdescription",
        projectimage: { asset: { _ref: "test" } },
        urlwww: [],
        urlgithub: []
      }];

      // First call fails with rate limit
      (client.fetch as jest.Mock).mockRejectedValueOnce(rateError);
      // Second call succeeds
      (client.fetch as jest.Mock).mockResolvedValueOnce(mockProjects);

      // First call should fail
      await expect(getProjects()).rejects.toThrow("Rate limit exceeded");

      // Second call should succeed
      const result = await getProjects();
      expect(result).toEqual(mockProjects);
    });
  });
});
